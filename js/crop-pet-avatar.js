(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {

  'use strict';

  // var url = $('.pet-img').attr('src');

  // if ($('.pet-avatar-preview').length > 1) {
  //   $('.pet-avatar-preview').empty().html('<img src="' + url + '">');
  // }

  var console = window.console || { log: function () {} };
  var pet_id;

  function CropPetAvatar($element) {
    this.$container = $element;

    this.$avatarView = this.$container.find('.pet-avatar-view');
    this.$avatar = this.$avatarView.find('img');
    this.$avatarModal = this.$container.find('#pet-avatar-modal');
    this.$loading = this.$container.find('.loading');

    this.$avatarForm = this.$avatarModal.find('.pet-avatar-form');
    this.$avatarUpload = this.$avatarForm.find('.pet-avatar-upload');
    this.$avatarSrc = this.$avatarForm.find('.pet-avatar-src');
    this.$avatarData = this.$avatarForm.find('.pet-avatar-data');
    this.$avatarInput = this.$avatarForm.find('.pet-avatar-input');
    this.$avatarSave = this.$avatarForm.find('.pet-avatar-save');
    this.$avatarBtns = this.$avatarForm.find('.pet-avatar-btns');

    this.$avatarWrapper = this.$avatarModal.find('.pet-avatar-wrapper');
    this.$avatarPreview = this.$avatarModal.find('.pet-avatar-preview');

    this.init();
    // $('#pet-avatar-input').change(function(){
    //   file  = this.files[0];
    //   console.log(file);

    //   if (file.size > 5242880) {
    //     $('#item-failed-upload-message').html('<p class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle"></i>&nbsp;File size must be less than 5 MB.</p>');
    //     $('.item-form').addClass('hidden');
    //     setTimeout(function() {
    //          location.reload();
    //     }, 6000);
    //   }
    // });
  }

  CropPetAvatar.prototype = {
    constructor: CropPetAvatar,

    support: {
      fileList: !!$('<input type="file">').prop('files'),
      blobURLs: !!window.URL && URL.createObjectURL,
      formData: !!window.FormData
    },

    init: function () {
      this.support.datauri = this.support.fileList && this.support.blobURLs;

      if (!this.support.formData) {
        this.initIframe();
      }

      this.initTooltip();
      this.initModal();
      this.addListener();
    },

    addListener: function () {
      this.$avatarView.on('click', $.proxy(this.click, this));
      this.$avatarInput.on('change', $.proxy(this.change, this));
      this.$avatarForm.on('submit', $.proxy(this.submit, this));
    },

    initTooltip: function () {
      this.$avatarView.tooltip({
        placement: 'bottom'
      });
    },

    initModal: function () {
      this.$avatarModal.modal({
        show: false
      });
    },

    initPreview: function () {
      var url = this.$avatar.attr('src');

      this.$avatarPreview.empty().html('<img src="' + url + '">');
    },

    initIframe: function () {
      var target = 'upload-iframe-' + (new Date()).getTime(),
          $iframe = $('<iframe>').attr({
            name: target,
            src: ''
          }),
          _this = this;

      // Ready ifrmae
      $iframe.one('load', function () {

        // respond response
        $iframe.on('load', function () {
          var data;

          try {
            data = $(this).contents().find('body').text();
          } catch (e) {
            console.log(e.message);
          }

          if (data) {
            try {
              data = $.parseJSON(data);
            } catch (e) {
              console.log(e.message);
            }

            _this.submitDone(data);
          } else {
            _this.submitFail('Image upload failed!');
          }

          _this.submitEnd();

        });
      });

      this.$iframe = $iframe;
      this.$avatarForm.attr('target', target).after($iframe.hide());
    },

    click: function () {
      this.$avatarModal.modal('show');
      this.initPreview();
    },

    change: function () {
      var files,
          file;

      if (this.support.datauri) {
        files = this.$avatarInput.prop('files');

        if (files.length > 0) {
          file = files[0];

          if (this.isImageFile(file)) {
            if (this.url) {
              URL.revokeObjectURL(this.url); // Revoke the old one
            }

            this.url = URL.createObjectURL(file);
            this.startCropper();
          }
        }
      } else {
        file = this.$avatarInput.val();

        if (this.isImageFile(file)) {
          this.syncUpload();
        }
      }
    },

    submit: function () {
      if (!this.$avatarSrc.val() && !this.$avatarInput.val()) {
        return false;
      }

      if (this.support.formData) {
        this.ajaxUpload();
        return false;
      }
    },

    isImageFile: function (file) {
      if (file.type) {
        return /^image\/\w+$/.test(file.type);
      } else {
        return /\.(jpg|jpeg|png|gif)$/.test(file);
      }
    },

    startCropper: function () {
      var _this = this;

      if (this.active) {
        this.$img.cropper('replace', this.url);
      } else {
        this.$img = $('<img src="' + this.url + '">');
        this.$avatarWrapper.empty().html(this.$img);
        this.$img.cropper({
          aspectRatio: 1,
          preview: this.$avatarPreview.selector,
          strict: false,
          crop: function (data) {
            var json = [
                  '{"x":' + data.x,
                  '"y":' + data.y,
                  '"height":' + data.height,
                  '"width":' + data.width + '}'
                ].join();

            _this.$avatarData.val(json);
          }
        });

        this.active = true;
      }
    },

    stopCropper: function () {
      if (this.active) {
        this.$img.cropper('destroy');
        this.$img.remove();
        this.active = false;
      }
    },

    ajaxUpload: function () {
      var url = this.$avatarForm.attr('action'),
          data = new FormData(this.$avatarForm[0]),
          _this = this;

      $.ajax(url, {
        type: 'post',
        data: data,
        dataType: 'json',
        processData: false,
        contentType: false,

        beforeSend: function () {
          _this.submitStart();
        },

        success: function (data) {
          _this.submitDone(data);
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
          _this.submitFail(textStatus || errorThrown);
        },

        complete: function () {
          _this.submitEnd();
        }
      });
    },

    syncUpload: function () {
      this.$avatarSave.click();
    },

    submitStart: function () {
      this.$loading.fadeIn();
      $(".pet-avatar-body").addClass("loading_circle");
      $(".pet-avatar-form").addClass("hidden");
    },

    submitDone: function (data) {
      console.log(data);

      $(".pet-avatar-body").removeClass("loading_circle");

      if ($.isPlainObject(data) && data.state === 200) {
        if (data.result) {
          this.url = data.result;

          if (this.support.datauri || this.uploaded) {
            this.uploaded = false;
            this.cropDone();
          } else {
            this.uploaded = true;
            this.$avatarSrc.val(this.url);
            this.startCropper();
          }

          this.$avatarInput.val('');
        } else if (data.message) {
          this.alert(data.message);
        }
      } else {
        this.alert('Failed to response');
      }
    },

    submitFail: function (msg) {
      this.alert(msg);
    },

    submitEnd: function () {
      this.$loading.fadeOut();
    },

    cropDone: function () {
      var currentDate = new Date();
      var today = currentDate.getFullYear()+"-"+currentDate.getDate()+"-"+currentDate.getMonth()+"-"+currentDate.getMinutes()+"-"+currentDate.getSeconds();

      this.$avatarForm.get(0).reset();
      this.$avatar.attr('src', 'http://petstapost.com/'+this.url + "?" + today);
      this.stopCropper();

      $('.pet-avatar-form').addClass('hidden');
      $('.pet-avatar-pic-upload').removeClass('hidden');

      var img_url = $('.pet-avatar-view img').attr('src');
      var username = $('#pet-username').text();
      var pet_id = $('#pet-id').text();
      var filename = today+'-'+username+'-pet-avatar.jpg';

      $('#script-container').html("<script>$('.pet-avatar-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&pet=original-filter&id="+pet_id+"',steps: {store: {path: '"+username+"/"+filename+"'}, import: {robot: '/http/import',url: '"+img_url+"'}}}});</script>");
    },

    alert: function (msg) {
      var $alert = [
            '<div class="alert alert-danger avater-alert">',
              '<button type="button" class="close" data-dismiss="alert">&times;</button>',
              msg,
            '</div>'
          ].join('');

      this.$avatarUpload.after($alert);
    }
  };

  $(function () {
    return new CropPetAvatar($('#crop-pet-avatar'));
  });

});
