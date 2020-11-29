var close = true;
var lastData = {};
var titlesize = 2.25;
var officersize = 1.6;
var officersizeme = 1.83;
var currentAction = null;

$(document).ready(()=>{
    
    $(document).on('input change', '#increase-size', function() {
        lastData.size =  $(this).val();
        lastData.me = Math.abs(officersizeme * $(this).val());
        lastData.title =  Math.abs(titlesize * $(this).val());
        lastData.officer = Math.abs(officersize * $(this).val());
        
        $('.title').css('font-size', `${lastData.title}rem`);
        $('.officer me').css('font-size', `${lastData.me}rem`);
        $('.officer').css('font-size', `${lastData.officer}rem`);
        $('.officer me').css('font-weight','bold');
    });
    
    $(document).on('input', '#opacity', function() {
        lastData.opacity =  $(this).val();
        ChangeBackGround($(this).val());
    });
    
    $(".restore-btn").on("click", function(){
        lastData = {};
        ChangeBackGround("0.7");
        $('.officer').css('font-size', `1rem`);
        $('.title').css('font-size', `1.35rem`);
        $('.range-inputes input').val("contrast");
        $('.officer.me').css('font-size', `1.1rem`);
    });
    
    $(".options-btns").on("click",".options-btn", function(){
        currentAction = $(this).data('action');
        SetRightInput(currentAction);
    });
    
    $(".inputs-id").on("click",".save-btn", function(){
        if (currentAction == null){
            $('.inputs-id #err-text').text('Please select an action');
            return;
        } else if (currentAction == "remove"){
            if ($('#id').val() == "")
            $('.inputs-id #err-text').text('The input can not be empty!');
            else 
            SendData(null);
        } else {
            if (($('#code').val() == "") || ($('#id').val() == ""))
            $('.inputs-id #err-text').text('The inputs can not be empty!');
            else
            SendData($('#code').val());
        }
    });
    
    $(".rank").on("click", function(){
        $('#rank-err').text("");
        if($('#rank').val() == "")
        $('#rank-err').text('The input can not be empty!');
        else 
        $.post('http://pr-10system/rank',JSON.stringify({rank : $('#rank').val()}));
    });
    

    $(".range-bar").prop('disabled', close);
    SwitchPages();
    DragAble();
    Close();
});

window.addEventListener("message",e => {
    if(e.data.action == "open"){
        if(lastData.opacity) {
            $('#opacity').val(lastData.opacity);
        } else if (lastData.size){
            $('#increase-size').val(lastData.size);
        }
        $('.warrper').show(500);
        $('.settings-container').slideDown();
    } else if (e.data.action == "error"){
        $('.inputs-id #err-text').text(e.data.errorText);
    }  else if (e.data.action == "update" && !close){
        $('.officers-container').html("");
        var officers = e.data.data;
        $('.title span').text(`שוטרים פעילים - משטרת ישראל (${officers.length})`);
        for(var officer of officers){
            var html;
            if (officer.me){
                if (officer.duty) {
                    html = `
                    <div class="officer me">
                    <span class="tag">${officer.callsign}</span> ${officer.name} | ${officer.rank} - <span class="officer-status onduty">בתפקיד</span>
                    </div>`
                } else {
                    html = `
                    <div class="officer me">
                    <span class="tag">${officer.callsign}</span> ${officer.name} | ${officer.rank} - <span class="officer-status offduty">לא בתפקיד</span>
                    </div>`
                }
                $('.officers-container').append(html);
            } else {
                if (officer.duty){
                    html = `
                    <div class="officer">
                    <span class="tag">${officer.callsign}</span> ${officer.name} | ${officer.rank} - <span class="officer-status onduty">בתפקיד</span>
                    </div>`
                } else {
                    html = `
                    <div class="officer">
                    <span class="tag">${officer.callsign}</span> ${officer.name} | ${officer.rank} - <span class="officer-status offduty">לא בתפקיד</span>
                    </div>`
                }
                $('.officers-container').append(html);
            }
        }
        $('.active-officers').slideDown();
        if (lastData.title && lastData.me && lastData.officer) {
            $('.title').css('font-size', `${lastData.title}rem`);
            $('.officer me').css('font-size', `${lastData.me}rem`);
            $('.officer').css('font-size', `${lastData.officer}rem`);
        }
    }
})


function toggle(){
    close = !close;
    $(".range-bar").prop('disabled', close);
    if (close) $('.active-officers').slideUp();
    $.post('http://pr-10system/ToggleOpen',JSON.stringify({toggle : close}))
}

function Close(){
    $("#close-del").on("click", function(){
        currentAction = null;
        $('input').val("");
        $('.warrper').hide();
        $('.settings-container').slideUp();
        $.post('http://pr-10system/close',JSON.stringify({}));
    });
}


function SetRightInput(action){
    if(action == "remove"){
        $('#code').hide();
    } else {
        $('#code').show();
    }
}

function SendData(code){
    var data = {
        action : currentAction,
        id : $('#id').val(),
        code : code
    }
    $('.inputs-id #err-text').text("");
    $.post('http://pr-10system/action',JSON.stringify({data : data}))
}

function ChangeBackGround(val){
    $('.active-officers').css('background-color', `rgba(0,0,0,${val})`);
    $('.title').css('background-color', `rgba(0,0,0,${addbits(val+0.05)})`);
}

function addbits(s) {
    var total = 0,
        s = s.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
        
    while (s.length) {
      total += parseFloat(s.shift());
    }
    return total;
}

function DragAble(){
    $( ".active-officers" ).draggable({
        appendTo: 'body',
        containment: 'window',
        scroll: false,
    });
}

function SwitchPages () {
    $(".slide-btnRight").on("click", function(){
        $('.page-1').fadeIn(200);
        $('.inputs-id').fadeOut(250);
        $('.settings-container-header span').text('Personal Settings');
    });
}

$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        currentAction = null;
        $('input').val("");
        $('.warrper').hide();
        $('.settings-container').slideUp();
        $.post('http://pr-10system/close',JSON.stringify({}))
    }
});
