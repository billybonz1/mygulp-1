$(function() {

	//Chrome Smooth Scroll
	try {
		$.browserSelector();
		if($("html").hasClass("chrome")) {
			$.smoothScroll();
		}
	} catch(err) {

	};

	$("img, a").on("dragstart", function(event) { event.preventDefault(); });

    $('.popup').magnificPopup();

});

//Форма отправки 2.0
$(function() {
    var error;
    function validate($this){
        var errorIN = 0;
        if ($this.val() == '' && !$this.hasClass("error")) {
            var errorfield = $this;
            $this.addClass('error').parent('.field').append('<div class="allert"><span>Заполните это поле</span><i aria-hidden="true"></i></div>');
            errorIN = 1;
        } else if ($this.attr("type") == 'checkbox') {
            if(!$this.is(":checked")){
                $this.addClass('error').parent('.field').append('<div class="allert"><span>Согласитесь пожалуйста на размещение отзыва</span><i aria-hidden="true"></i></div>');
                errorIN = 1;
            }
        } else {
            var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
            if ($this.attr("name") == 'email') {
                if(!pattern.test($this.val())) {
                    $("[name=email]").val('');
                    $this.addClass('error').parent('.field').append('<div class="allert"><span>Укажите коректный e-mail</span><i aria-hidden="true"></i></div>');
                    errorIN = 1;
                }
            }
            var patterntel = /^()[0-9]{9,18}/i;
            if ( $this.attr("type") == 'tel') {
                if(!patterntel.test($this.val())) {
                    $("[name=phone]").val('');
                    $this.addClass('error').parent('.field').append('<div class="allert"><span>Укажите коректный номер телефона</span><i aria-hidden="true"></i></div>');
                    errorIN = 1;
                }
            }
        }
        return errorIN;
    }
    $("[required]").each(function(){
        $(this).change(function () {
            if($(this).attr("type") == 'file'){
                $(this).removeClass('error').parent('.field').find(".allert").remove();
                var value = $(this).val();
                if(value){
                    var file = value.split("\\").reverse();
                    var ext = file[0].split(".").reverse();
                    if(ext[0] != "jpg" && ext[0] != "png"){
                        $(this).addClass('error').parent('.field').append('<div class="allert"><span>Не корректный формат файла. Поддерживается jpg и png</span><i aria-hidden="true"></i></div>');
                        error = 1;
                    }
                }
            }
        });
        $(this).change(function() {
            $(this).removeClass('error').parent('.field').find(".allert").remove();
            validate($(this));
        });
        $(this).on("keyup",function() {
            $(this).removeClass('error').parent('.field').find(".allert").remove();
            validate($(this));
        });
        $(this).blur(function() {
            $(this).removeClass('error').parent('.field').find(".allert").remove();
            validate($(this));
        });
    });


    $("[name=send]").click(function () {
        error = 0;
        $(":input.error").removeClass('error');
        $(".allert").remove();


        var btn = $(this);
        var ref = btn.closest('form').find('[required]');
        var msg = btn.closest('form').find('input, textarea');
        var send_btn = btn.closest('form').find('[name=send]');
        var form = $(this).closest('form'), name = form.find('[name=name]').val();
        $(msg).each(function () {
            if($(this).attr("type") == 'file'){
                $(this).removeClass('error').parent('.field').find(".allert").remove();
                var value = $(this).val();
                if(value){
                    var file = value.split("\\").reverse();
                    var ext = file[0].split(".").reverse();
                    if(ext[0] != "jpg" && ext[0] != "png"){
                        $(this).addClass('error').parent('.field').append('<div class="allert"><span>Не корректный формат файла. Поддерживается jpg и png</span><i aria-hidden="true"></i></div>');
                        error = 1;
                    }
                }
            }
        });
        $(ref).each(function() {
            validate($(this));
            $(":input.error:first").focus();
        });


        if(!(error==1)) {
            $(send_btn).each(function() {
                $(this).attr('disabled', true);
            });
            var formData = new FormData(form[0]);

            $.ajax({
                type: 'POST',
                url: '/mail.php',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data) {
                    var thxhtml = $("#thankyou h3");
                    if(fbtrack == 'action'){
                        thxhtml.html("Спасибо. Ваш подарок закреплен<br>  с Вами сейчас свяжеться наш менеджер для уточнения деталей.");
                    }else if(fbtrack == 'reviews'){
                        thxhtml.html("Спасибо. Ваш отзыв<br>  успешно отправлен !");
                    }else{
                        thxhtml.html("Спасибо. Ваша заявка<br>  успешно отправлена ! С вами сейчас свяжется наш менеджер.");
                    }
                    $("[href='#thankyou']").click();
                    form.trigger("reset");
                    setTimeout(function(){  $("[name=send]").removeAttr("disabled"); }, 1000);
                    // Настройки модального окна после удачной отправки
                },
                error: function(xhr, str) {
                    alert('Возникла ошибка: ' + xhr.responseCode);
                }
            });
        }
        return false;
    });
});