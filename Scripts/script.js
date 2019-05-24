function ajax(url, data = {}, callbackSuccess = function(data, textStatus) {

}, callbackError = function(data, textStatus, errorThrown) {

}) {
  $.ajax({
    url: url,
    header: 'Content-type: application/json',
    type: "POST",
    data: data,
    error: callbackError,
    success: callbackSuccess,
  });
}

function validate(token){
  if($("#RegisterBackground").css("display") == 'none'){
    login();
  }else{
    let name = $("#Name").val();
    let lastName = $("#LastName").val();
    let email1 = $("#Email1").val();
    let password1 = $("#Password1").val();

    $("#Register").attr("disabled", true);
    $("#Register > i").removeClass("fa-user-plus fa-exclamation-triangle").addClass("fa-circle-notch fa-spin");
    $(".registerContainer").css("cursor", "progress");

    ajax("Parts/Header/PHPScript/PHPCodeRegister.php", {
      Name: name,
      LastName: lastName,
      Email: email1,
      Password: password1
    }, callbackSuccess = function(data) {
      $(".registerContainer").css("cursor", "");
      data = JSON.parse(data);

      if (data.email) {
        $("#Email1").addClass("BarFault");
        $("#errorEmail1").html("<i class='fas fa-exclamation-triangle'></i> Email bestaat al.");
        $("#Register > i").removeClass("fa-circle-notch fa-spin").addClass("fa-exclamation-triangle");
        $("#Register").attr("disabled", false);
      }

      if (data.created) {
        $("#verplicht").html("Er is een activatie mail verzonden.");

        $("#Register > i").removeClass("fa-circle-notch fa-spin").addClass("fa-check");
      }
    });
  }

  grecaptcha.reset();
}

// Eerst ga je nakijken of de display op none staat.
// Als dit op none staat spreek je de functie fadeIn aan. (zorgt voor het langzaam verschijnen)(100 is tijd in ms)
// (2de parameter van de functie is de functie dat gerunned wordt als de fadeIn volledig klaar is)
// fadeOut is hetzelfde als de fadeIn
function loginFunction() {
  if ($("#LoginBackground").css("display") == 'none') {
    $("#LoginBackground").fadeIn(100);
  } else {
    $("#LoginBackground").fadeOut(100, function() {
      $(".registerContainer").css("cursor", "");
    });
  }
}

function registerFunction() {
  if ($("#RegisterBackground").css("display") == 'none') {
    $("#RegisterBackground").fadeIn(100);
  } else {
    $("#RegisterBackground").fadeOut(100, function() {
      $(".loginContainer").css("cursor", "");
    });
  }
}

function login() {
  let email = $("#loginInputEmail").val();
  let password = $("#loginInputPass").val();
  $(".loginContainer").css("cursor", "progress");

  ajax("Parts/Header/PHPScript/LoginCheck.php", {
    Email: email,
    Password: password
  }, callbackSuccess = function(data) {
    $(".loginContainer").css("cursor", "");
    console.log(data);
    data = JSON.parse(data);
    if (data.valid) {
      location.reload();
    }else{
      $("#errormMelding").html("<i class='fas fa-exclamation-triangle'></i> " + data.userMsg);
      $("#loginInputEmail").addClass("BarFault");
      $("#loginInputPass").addClass("BarFault");
    }
  });
}

function register() {
  // regexMail standaard Email
  // Source: https://emailregexMail.com/
  let regexMail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if ($("#Register").attr("disabled")) {
    return;
  }

  let error = false;

  let name = $("#Name").val();
  let lastName = $("#LastName").val();
  let email1 = $("#Email1").val();
  let password1 = $("#Password1").val();
  let password2 = $("#Password2").val();

  if (name == '') {
    $("#Name").addClass("BarFault");
    $("#errorName").html("<i class='fas fa-exclamation-triangle'></i> Vul een naam in.");
    error = true;
  } else {
    $("#Name").removeClass("BarFault");
    $("#errorName").html(" ");
  }

  if (lastName == '') {
    $("#LastName").addClass("BarFault");
    $("#errorLastname").html("<i class='fas fa-exclamation-triangle'></i> Vul een achternaam in.");
    error = true;
  } else {
    $("#lastName").removeClass("BarFault");
    $("#errorLastname").html(" ");
  }

  if (email1 == '') {
    $("#Email1").addClass("BarFault");
    $("#errorEmail1").html("<i class='fas fa-exclamation-triangle'></i> Vul een e-mailadres in.");
    error = true;
  } else if (!regexMail.test(email1)) {
    $("#Email1").addClass("BarFault");
    $("#errorEmail1").html("<i class='fas fa-exclamation-triangle'></i> Vul een correct e-mailadres in.");
  } else {
    $("#Email1").removeClass("BarFault");
    $("#errorEmail1").html("");
  }

  if (password1 == '') {
    $("#Password1").addClass("BarFault");
    $("#errorPassword1").html("<i class='fas fa-exclamation-triangle'></i> Vul een wachtwoord in.");
    error = true;
  } else {
    $("#Password1").removeClass("BarFault");
    $("#errorPassword1").html(" ");
  }

  if (password2 == '') {
    $("#Password2").addClass("BarFault");
    $("#errorPassword2").html("<i class='fas fa-exclamation-triangle'></i> Vul een wachtwoord in.");
    error = true;
  } else {
    $("#Password2").removeClass("BarFault");
    $("#errorPassword2").html(" ");
  }

  if (password1 != password2) {
    $("#Password2").addClass("BarFault");
    $("#Password1").addClass("BarFault");
    $("#errorPassword2").html(" ");
    $("#errorPassword1").html("<i class='fas fa-exclamation-triangle'></i> Wachtwoord komt niet overeen.");
    error = true;
  }

  if (!error) {
    grecaptcha.execute();
  }
}

function toggleActivation(warning = false, msg = "") {
  if ($("#activateAccount").css("display") == "block") {
    $("#activateAccount").css("display", "");
  } else {
    $("#activateAccount").fadeIn(350);
  }

  $("#activateAccount > span:nth-child(2)").html(msg);

  if (warning) {
    $("#activateAccount > i").css("display", "");
  } else {
    $("#activateAccount > i").css("display", "none");
  }
}

$(document).ready(function() {

  var get = {};
  location.search.replace('?', '').split('&').forEach(function(s) {
    let fullPart = s.split('=');
    get[fullPart[0]] = fullPart[1];
  });

  $("#loginButton").click(function (){
    let email = $("#loginInputEmail").val();
    let password = $("#loginInputPass").val();

    if(email == ""){
      $("#errormMelding").html("<i class='fas fa-exclamation-triangle'></i> Email is niet ingevuld");
      $("#loginInputEmail").addClass("BarFault");
    }else if(password == ""){
      $("#errormMelding").html("<i class='fas fa-exclamation-triangle'></i> Wachtwoord is niet ingevuld");
      $("#loginInputPass").addClass("BarFault");
    }else{
      grecaptcha.execute();
    }
  });

  $("#Register").click(register);

  $("#activateAccount > span:nth-child(3)").click(function() {
    window.history.pushState({}, "", "/");
    toggleActivation();
  });

  if (get["email"] && get["activatie"]) {
    ajax("Parts/Header/PHPScript/ActivateAccount.php", {
      Email: get ["email"],
      Hash: get ["activatie"]
    }, callbackSuccess = function(data) {
      console.log(data);
      data = JSON.parse(data);

      if (data.userMsg != "") {
        toggleActivation(!data.valid, data.userMsg);
      }
    });
  }

  //Handled clicks op login button en kruisje van login scherm
  $("#LoginButton").click(loginFunction);
  $("#loginClose").click(loginFunction);

  $("#RegisterButton").click(registerFunction);
  $("#registerClose").click(registerFunction);

  $("#RegisterLogin").click(loginFunction);
  $("#RegisterLogin").click(registerFunction);

  $(".form").submit(function(e){
     e.preventDefault();
  });

  $("#logoutButton").click(function() {
    ajax("Parts/Header/PHPScript/LogoutScript.php", {}, callbackSuccess = function(data) {
      data = JSON.parse(data);
      if (data.loggedOut) {
        location.reload();
      }
    });
  });

  $("#downloadButton").click(function (){
    location.href = "downloads/Setup Wireshell.msi";
  });
});
