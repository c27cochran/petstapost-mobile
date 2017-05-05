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

  var url = $('.cover-pic').attr('src');

  if ($('.cover-preview').length > 1) {
    $('.cover-preview').empty().html('<img src="' + url + '">');
  }

  var console = window.console || { log: function () {} };

  var file;

  function CropCover($element) {
    this.$container = $element;

    this.$coverView = this.$container.find('.cover-view');
    this.$cover = this.$coverView.find('img');
    this.$coverModal = this.$container.find('#cover-modal');
    this.$loading = this.$container.find('.loading');
    this.$coverDiv = $('.intro-body').find('#cover-pic-file');

    this.$coverForm = this.$coverModal.find('.cover-form');
    this.$coverUpload = this.$coverForm.find('.cover-upload');
    this.$coverSrc = this.$coverForm.find('.cover-src');
    this.$coverData = this.$coverForm.find('.cover-data');
    this.$coverInput = this.$coverDiv.find('.cover-input');
    this.$coverSave = this.$coverForm.find('.cover-save');
    this.$coverBtns = this.$coverForm.find('.cover-btns');

    this.$coverWrapper = this.$coverModal.find('.cover-wrapper');
    this.$coverPreview = this.$coverModal.find('.cover-preview');

    this.init();
    $('#cover-input').change(function(){
      file  = this.files[0];

      if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg' && file.type != 'image/gif') {
        
        $('#cover-failed-upload-message').html('<p class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle"></i>&nbsp;Accepted formats are .png, .jpg, .jpeg and .gif</p>');
        $('.cover-form').addClass('hidden');
        setTimeout(function() {
             location.reload();
        }, 6000);

      } else if (file.size > 5242880) {
        $('#cover-failed-upload-message').html('<p class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle"></i>&nbsp;File size must be less than 5 MB.</p>');
        $('.cover-form').addClass('hidden');
        setTimeout(function() {
             location.reload();
        }, 6000);
      }
    });
  }

  CropCover.prototype = {
    constructor: CropCover,

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
      this.$coverView.on('click', $.proxy(this.click, this));
      this.$coverInput.on('change', $.proxy(this.change, this));
      this.$coverForm.on('submit', $.proxy(this.submit, this));
    },

    initTooltip: function () {
      this.$coverView.tooltip({
        placement: 'bottom'
      });
    },

    initModal: function () {
      this.$coverModal.modal({
        show: false
      });
    },

    initPreview: function () {
      var url = this.$cover.attr('src');

      this.$coverPreview.empty().html('<img src="' + url + '">');
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
      this.$coverForm.attr('target', target).after($iframe.hide());
    },

    click: function () {
      this.$coverModal.modal('show');
      this.initPreview();
    },

    change: function () {
      var files,
          file;

      if (this.support.datauri) {
        files = this.$coverInput.prop('files');

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
        file = this.$coverInput.val();

        if (this.isImageFile(file)) {
          this.syncUpload();
        }
      }
    },

    submit: function () {
      if (!this.$coverSrc.val() && !this.$coverInput.val()) {
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
        this.$coverWrapper.empty().html(this.$img);
        this.$img.cropper({
          aspectRatio: 2 / 1,
          preview: this.$coverPreview.selector,
          strict: false,
          crop: function (data) {
            var json = [
                  '{"x":' + data.x,
                  '"y":' + data.y,
                  '"height":' + data.height,
                  '"width":' + data.width + '}'
                ].join();

            _this.$coverData.val(json);
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
      var url = this.$coverForm.attr('action');
      var data = new FormData(this.$coverForm[0]);
      data.append('cover_file', file);
      var _this = this;

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
      this.$coverSave.click();
    },

    submitStart: function () {
      this.$loading.fadeIn();
      $(".cover-body").addClass("loading_circle");
      $(".cover-form").addClass("hidden");
    },

    submitDone: function (data) {

      $(".cover-body").removeClass("loading_circle");
      console.log(data);

      if ($.isPlainObject(data) && data.state === 200) {
        if (data.result) {
          this.url = data.result;

          if (this.support.datauri || this.uploaded) {
            this.uploaded = false;
            this.cropDone();
          } else {
            this.uploaded = true;
            this.$coverSrc.val(this.url);
            this.startCropper();
          }

          this.$coverInput.val('');
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

      this.$coverForm.get(0).reset();
      this.$cover.attr('src', 'http://petstapost.com/'+this.url + "?" + today);
      this.stopCropper();
      // this.$coverModal.modal('hide');
      $('.cover-form').addClass('hidden');
      $('.cover-pic-upload').removeClass('hidden');
      // $('.new-cover').val($('.cover-view img').attr('src'));
      var img_url = $('.cover-view img').attr('src');
      var username = $('#cover-username').text();

      $('#script-container').html("<script>$('.cover-pic-upload').transloadit({wait: true, params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&cover=original-filter',steps: {store: {path: '"+username+"/cover.png'}, import: {robot: '/http/import',url: '"+img_url+"'}}}});</script>");
    },

    alert: function (msg) {
      var $alert = [
            '<div class="alert alert-danger avater-alert">',
              '<button type="button" class="close" data-dismiss="alert">&times;</button>',
              msg,
            '</div>'
          ].join('');

      this.$coverUpload.after($alert);
    }
  };

  $(function () {
    return new CropCover($('#crop-cover'));
  });

});
