// ========================================
// AUTHENTICATION
// ========================================

import { clearFavorites } from "./favorites.js";




// ========================================
// DOM ELEMENTS
// ========================================

const authBtn = document.getElementById("authBtn");
const authBtnText = document.getElementById("authBtnText");

const authContainer = document.getElementById("authContainer");
const authClose = document.getElementById("authClose");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");


// ========================================
// STORAGE KEYS
// ========================================

const USERS_KEY = "cineverse_users";
const CURRENT_USER_KEY = "cineverse_current_user";

// ========================================
// GET USERS
// ========================================

function getUsers() {

    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];

}

// ========================================
// SAVE USERS
// ========================================

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


// ========================================
// GET CURRENT USER
// ========================================

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem(CURRENT_USER_KEY)
    );

}

export function isLoggedIn() {
    return !!getCurrentUser();
}

// ========================================
// SAVE CURRENT USER
// ========================================

function saveCurrentUser(user) {

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
    );

}

// ========================================
// OPEN AUTH MODAL
// ========================================

export function openAuthModal() {

    if (!authContainer) return;

    authContainer.classList.add("active");

    showLoginForm();

}

// ========================================
// CLOSE AUTH MODAL
// ========================================

function closeAuthModal() {

    if (!authContainer) return;

    authContainer.classList.remove("active");

}

// ========================================
// ACCOUNT MODAL
// ========================================

const accountContainer =
    document.getElementById("accountContainer");

const accountClose =
    document.getElementById("accountClose");

const accountName =
    document.getElementById("accountName");

const accountEmail =
    document.getElementById("accountEmail");

const accountLogout =
    document.getElementById("accountLogout");

const accountFavorites =
    document.getElementById("accountFavorites");


// ========================================
// OPEN ACCOUNT MODAL
// ========================================

function openAccountModal(user) {

    if (!accountContainer || !user) return;

    accountName.textContent = user.name;
    accountEmail.textContent = user.email;

    accountContainer.classList.add("active");

}


// ========================================
// CLOSE ACCOUNT MODAL
// ========================================

function closeAccountModal() {

    if (!accountContainer) return;

    accountContainer.classList.remove("active");

}

// ========================================
// SHOW LOGIN FORM
// ========================================

function showLoginForm() {

    if (!loginForm || !registerForm) return;

    loginForm.classList.remove("hidden");

    registerForm.classList.add("hidden");


    if (authTitle) {

        authTitle.textContent = "Welcome Back";

    }

    if (authSubtitle) {

        authSubtitle.textContent = "Sign in to continue to CineVerse";

    }

    clearMessages();

}

// ========================================
// SHOW REGISTER FORM
// ========================================

function showRegisterForm() {

    if (!loginForm || !registerForm) return;

    loginForm.classList.add("hidden");

    registerForm.classList.remove("hidden");


    if (authTitle) {

        authTitle.textContent = "Create Account";

    }


    if (authSubtitle) {

        authSubtitle.textContent = "Join CineVerse and save your favorite movies";

    }

    clearMessages();

}

// ========================================
// CLEAR MESSAGES
// ========================================

function clearMessages() {

    if (loginMessage) {

        loginMessage.textContent = "";

    }


    if (registerMessage) {

        registerMessage.textContent = "";

    }

}

// ========================================
// REGISTER USER
// ========================================

function registerUser(event) {

    event.preventDefault();

    const name = document.getElementById("registerName")?.value.trim();

    const email = document.getElementById("registerEmail")?.value.trim().toLowerCase();

    const password = document.getElementById("registerPassword")?.value;

    const confirmPassword = document.getElementById("registerConfirmPassword")?.value;

    // ========================================
    // VALIDATION
    // ========================================

    if (!name || !email || !password || !confirmPassword) {

        registerMessage.textContent = "Please fill in all fields.";

        return;

    }

    // ========================================
    // PASSWORD MATCH
    // ========================================

    if (password !== confirmPassword) {

        registerMessage.textContent = "Passwords do not match.";

        return;

    }

    // ========================================
    // PASSWORD LENGTH
    // ========================================

    if (password.length < 6) {

        registerMessage.textContent = "Password must be at least 6 characters.";

        return;

    }

    // ========================================
    // GET USERS
    // ========================================

    const users = getUsers();

    // ========================================
    // CHECK EXISTING EMAIL
    // ========================================

    const existingUser = users.find(
        user => user.email === email
    );


    if (existingUser) {

        registerMessage.textContent = "An account with this email already exists.";

        return;

    }

    // ========================================
    // CREATE USER
    // ========================================

    const newUser = {

        id: Date.now(),

        name,

        email,

        password,

        createdAt: new Date().toISOString()

    };

    // ========================================
    // SAVE USER
    // ========================================

    users.push(newUser);

    saveUsers(users);

    // ========================================
    // AUTO LOGIN
    // ========================================

    saveCurrentUser({

        id: newUser.id,

        name: newUser.name,

        email: newUser.email

    });

    // ========================================
    // RESET FORM
    // ========================================

    registerForm.reset();

    // ========================================
    // CLOSE MODAL
    // ========================================

    closeAuthModal();

    // ========================================
    // UPDATE NAVBAR
    // ========================================

    updateAuthUI();

    console.log(
        "User registered:",
        newUser.email
    );

}

// ========================================
// LOGIN USER
// ========================================

function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();

    const password = document.getElementById("loginPassword")?.value;

    if (!email || !password) {

        loginMessage.textContent = "Please enter your email and password.";

        return;

    }


    // ========================================
    // GET USERS
    // ========================================

    const users = getUsers();


    // ========================================
    // FIND USER
    // ========================================

    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );


    // ========================================
    // INVALID LOGIN
    // ========================================

    if (!user) {

        loginMessage.textContent = "Invalid email or password.";

        return;

    }


    // ========================================
    // SAVE CURRENT USER
    // ========================================

    saveCurrentUser({

        id: user.id,

        name: user.name,

        email: user.email

    });

    // ========================================
    // RESET FORM
    // ========================================

    loginForm.reset();

    // ========================================
    // CLOSE MODAL
    // ========================================

    closeAuthModal();

    // ========================================
    // UPDATE NAVBAR
    // ========================================

    updateAuthUI();

    console.log("User logged in:", user.email);

}

// ========================================
// LOGOUT USER
// ========================================

function logoutUser() {

    // Clear logged-in user
    localStorage.removeItem(CURRENT_USER_KEY);

    // Clear favorites
    clearFavorites();

    // Update navbar
    updateAuthUI();

    console.log("User logged out");

}

// ========================================
// UPDATE AUTH UI
// ========================================

function updateAuthUI() {

    if (!authBtn || !authBtnText) return;

    const user = getCurrentUser();

    if (user) {

        authBtnText.textContent = user.name;

        authBtn.classList.add("logged-in");

        console.log("Current user:",user.name);

    } else {

        authBtnText.textContent = "Sign In";

        authBtn.classList.remove("logged-in");

    }

}

// ========================================
// PASSWORD VISIBILITY
// ========================================

function initPasswordToggle() {

    const buttons = document.querySelectorAll(".password-toggle");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

                const targetId = button.dataset.target;

                const input = document.getElementById(targetId);

                const icon = button.querySelector("i");

                if (!input || !icon) return;

                if (input.type === "password") {

                    input.type = "text";

                    icon.classList.remove("fa-eye");

                    icon.classList.add("fa-eye-slash");

                } else {

                    input.type = "password";

                    icon.classList.remove("fa-eye-slash");

                    icon.classList.add("fa-eye");

                }

            }
        );

    });

}

// ========================================
// EVENT LISTENERS
// ========================================

function initAuth() {

    console.log("AUTH MODULE INITIALIZED");

    // ========================================
    // CHECK REQUIRED ELEMENTS
    // ========================================

    if (!authBtn) {

        console.error("Auth button not found!");

        return;

    }

    if (!authContainer) {

        console.error("Auth container not found!");

        return;

    }

    // ========================================
    // OPEN AUTH MODAL
    // ========================================

    authBtn.addEventListener("click", () => {

    const user = getCurrentUser();

    if (user) {
        openAccountModal(user);
    } else {
        openAuthModal();
    }

    });

    // ========================================
    // CLOSE BUTTON
    // ========================================

    if (authClose) {

        authClose.addEventListener("click", closeAuthModal);

    }

    // ========================================
    // CLOSE ON OVERLAY CLICK
    // ========================================

    authContainer.addEventListener(
        "click",
        event => {

            if (event.target === authContainer) {

                closeAuthModal();

            }

        }
    );

    // ========================================
    // SHOW REGISTER
    // ========================================

    if (showRegister) {

        showRegister.addEventListener(
            "click",
            showRegisterForm
        );

    }

    // ========================================
    // SHOW LOGIN
    // ========================================

    if (showLogin) {

        showLogin.addEventListener(
            "click",
            showLoginForm
        );

    }

    // ========================================
    // LOGIN
    // ========================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            loginUser
        );

    }

    // ========================================
    // REGISTER
    // ========================================

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            registerUser
        );

    }

    // ========================================
    // PASSWORD TOGGLE
    // ========================================

    initPasswordToggle();

    // ========================================
    // RESTORE LOGIN STATE
    // ========================================

    updateAuthUI();

    // ========================================
// ACCOUNT CLOSE
// ========================================

if (accountClose) {

    accountClose.addEventListener(
        "click",
        closeAccountModal
    );

}


// ========================================
// ACCOUNT OVERLAY
// ========================================

if (accountContainer) {

    accountContainer.addEventListener(
        "click",
        event => {

            if (event.target === accountContainer) {
                closeAccountModal();
            }

        }
    );

}


// ========================================
// LOGOUT
// ========================================

if (accountLogout) {

    accountLogout.addEventListener(
        "click",
        () => {

            closeAccountModal();

            logoutUser();

        }
    );

}


// ========================================
// FAVORITES
// ========================================

if (accountFavorites) {

    accountFavorites.addEventListener(
        "click",
        () => {

            closeAccountModal();

            // Open existing favorites modal
            const favoriteBtn =
                document.querySelector(".favourite-btn");

            if (favoriteBtn) {
                favoriteBtn.click();
            }

        }
    );

}

}

// ========================================
// EXPORT
// ========================================

export default initAuth;