
<div class="blackbackground" id="RegisterBackground">
  <form class="form">
    <div class="registerContainer">
        <img class = "logoRegister" src = "../../style/logo.png">
        <span class="RegisterSpan">Registreer</span>
        <div class="crossRegister" id="registerClose"><i class="fas fa-times"></i></div>

        <div class="nameContainer">
            <input type="text" class="Bar" id="Name" placeholder="* Naam" />
            <span class="errorBox" id="errorName"></span>
        </div>

        <div class="lastnameContainer">
            <input type="text" class="Bar" id="LastName" placeholder="* Achternaam" />
            <span class="errorBox" id="errorLastname"></span>
        </div>

        <div class="emailContainer">
            <input type="email" class="Bar" id="Email1" placeholder="* E-mailadres" />
            <span class="errorBox" id="errorEmail1"></span>
        </div>

        <div class="passwordContainer">
            <input type="password" class="Bar" id="Password1" placeholder="* Passwoord" />
            <span class="errorBox" id="errorPassword1"></span>
        </div>

        <div class="passwordContainer2">
            <input type="password" class="Bar" id="Password2" placeholder="* Bevestig Passwoord" />
            <span class="errorBox" id="errorPassword2"></span>
        </div>

        <button type="submit" class = "register" id = "Register"><i class="fas fa-user-plus"></i> Registreer</button>

        <p class="verplicht" id = "verplicht">* verplicht</p>
      </form>
    </div>
</div>
