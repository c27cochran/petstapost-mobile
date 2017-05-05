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

  var url = $('.item-pic').attr('src');

  if ($('.item-preview').length > 1) {
    $('.item-preview').empty().html('<img src="' + url + '">');
  }

  var console = window.console || { log: function () {} };

  var file;

  function ItemCover($element) {
    this.$container = $element;

    this.$itemView = this.$container.find('.item-view');
    this.$item = this.$itemView.find('img');
    this.$itemModal = this.$container.find('#item-modal');
    this.$loading = this.$container.find('.loading');
    this.$itemDiv = $('.intro-body').find('#profile-item-file');

    this.$itemForm = this.$itemModal.find('.item-form');
    this.$itemUpload = this.$itemForm.find('.item-upload');
    this.$itemSrc = this.$itemForm.find('.item-src');
    this.$itemData = this.$itemForm.find('.item-data');
    this.$itemInput = this.$itemDiv.find('.item-input');
    this.$itemSave = this.$itemForm.find('.item-save');
    this.$itemBtns = this.$itemForm.find('.item-btns');

    this.$itemWrapper = this.$itemModal.find('.item-wrapper');
    this.$itemPreview = this.$itemModal.find('.item-preview');

    this.init();
    $('#item-input').change(function(){
      file  = this.files[0];
      console.log(file);

      if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg' && file.type != 'image/gif' && file.type != 'video/mp4' && file.type != 'video/quicktime') {
        
        $('#item-failed-upload-message').html('<p class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle"></i>&nbsp;Accepted formats are .png, .jpg, .jpeg, .gif .mov and .mp4</p>');
        $('.item-form').addClass('hidden');
        setTimeout(function() {
             location.reload();
        }, 6000);

      } else if (file.type == 'video/mp4' || file.type == 'video/quicktime') {

        if (file.size > 10485760) {
          $('#item-failed-upload-message').html('<p class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle"></i>&nbsp;Video file size must be less than 10 MB.</p>');
          $('.item-form').addClass('hidden');
          setTimeout(function() {
               location.reload();
          }, 6000);
        }

        $('.item-form').addClass('hidden');
        $('#item-modal').modal('hide');
        $('.vid-caption-upload').removeClass('hidden');
        $('#profile-item-file').addClass('hidden');

      } else if (file.size > 5242880) {
        
        $('#item-failed-upload-message').html('<p class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle"></i>&nbsp;File size must be less than 5 MB.</p>');
        $('.item-form').addClass('hidden');
        setTimeout(function() {
             location.reload();
        }, 6000);
        
      }

      $('.video-save').on('click', function(e) {
        var username = $('#item-username').text();
        var filename = file.name;
        var currentDate = new Date();
        var today = currentDate.getFullYear()+""+currentDate.getDate()+""+currentDate.getMonth()+""+currentDate.getMinutes()+""+currentDate.getSeconds();
        var thumb_filename = today+'thumbfile.jpg';
        $('#script-container').html('<script>$(".video-upload").transloadit({wait:!0,triggerUploadOnFileSelection:!0,params:{auth:{key:"7ff67dc0d5a811e4867d652aa057a4fd"},template_id: "7ae79760ee8011e4a145b969e2410dd0", redirect_url: "http://petstapost.com/yappy.php?user='+username+'&video",steps:{store_video: {path: "'+username+'/'+filename+'"},store_thumb: {path: "'+username+'/'+thumb_filename+'"},iphone_video:{use:":original",robot:"/video/encode",preset:"iphone"},extracted_thumbs:{use:"iphone_video",robot:"/video/thumbs",count:1,width:640,height:640}}}});</script>');
      });
    });
  }

  ItemCover.prototype = {
    constructor: ItemCover,

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
      this.$itemView.on('click', $.proxy(this.click, this));
      this.$itemInput.on('change', $.proxy(this.change, this));
      this.$itemForm.on('submit', $.proxy(this.submit, this));
    },

    initTooltip: function () {
      this.$itemView.tooltip({
        placement: 'bottom'
      });
    },

    initModal: function () {
      this.$itemModal.modal({
        show: false
      });
    },

    initPreview: function () {
      var url = this.$item.attr('src');

      this.$itemPreview.empty().html('<img src="' + url + '">');
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
      this.$itemForm.attr('target', target).after($iframe.hide());
    },

    click: function () {
      this.$itemModal.modal('show');
      this.initPreview();
    },

    change: function () {
      var files,
          file;

      if (this.support.datauri) {
        files = this.$itemInput.prop('files');

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
        file = this.$itemInput.val();

        if (this.isImageFile(file)) {
          this.syncUpload();
        }
      }
    },

    submit: function () {
      if (!this.$itemSrc.val() && !this.$itemInput.val()) {
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
        this.$itemWrapper.empty().html(this.$img);
        this.$img.cropper({
          aspectRatio: 1,
          preview: this.$itemPreview.selector,
          strict: false,
          crop: function (data) {
            var json = [
                  '{"x":' + data.x,
                  '"y":' + data.y,
                  '"height":' + data.height,
                  '"width":' + data.width + '}'
                ].join();

            _this.$itemData.val(json);
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

      var url = this.$itemForm.attr('action');
      var data = new FormData(this.$itemForm[0]);
      data.append('item_file', file);
      var _this = this;

      $.ajax({
        url: url,
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
      this.$itemSave.click();
    },

    submitStart: function () {
      this.$loading.fadeIn();
      $(".item-body").addClass("loading_circle");
      $(".item-form").addClass("hidden");
    },

    submitDone: function (data) {

      $(".item-body").removeClass("loading_circle");

      if ($.isPlainObject(data) && data.state === 200) {
        if (data.itemname) {
          $('#item-filename').html(data.itemname);
        } else {
          $('#item-filename').html('no_filename.jpg');
        }
        if (data.result) {
          this.url = data.result;

          if (this.support.datauri || this.uploaded) {
            this.uploaded = false;
            this.cropDone();
          } else {
            this.uploaded = true;
            this.$itemSrc.val(this.url);
            this.startCropper();
          }

          this.$itemInput.val('');
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

      this.$itemForm.get(0).reset();
      this.$item.attr('src', 'http://petstapost.com/'+this.url + "?" + today);
      this.stopCropper();
      // this.$itemModal.modal('hide');
      $('.item-form').addClass('hidden');
      $('.item-pic-upload').removeClass('hidden');
      
      var img_url = $('.item-view img').attr('src');
      var username = $('#item-username').text();
      var filename = $('#item-filename').text();
      $('#script-container').html("<script>$('.item-pic-upload').transloadit({wait: true, params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"',steps: {store: {path: '"+username+"/"+filename+"'}, import: {robot: '/http/import',url: '"+img_url+"'}}}});</script>");
    },

    alert: function (msg) {
      var $alert = [
            '<div class="alert alert-danger avater-alert">',
              '<button type="button" class="close" data-dismiss="alert">&times;</button>',
              msg,
            '</div>'
          ].join('');

      this.$itemUpload.after($alert);
    }
  };

  $(function () {
    return new ItemCover($('#crop-item'));
  });

});
