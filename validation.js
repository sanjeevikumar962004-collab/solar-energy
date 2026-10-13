/**
 * Stackly Renewable Energy - Global Premium Form Validation & State System
 * Handles:
 * 1. Premium live validation (real-time validation on blur/input)
 * 2. Login & Sign-up flow with validation constraints
 * 3. Settings updates & state binding (name, email) in user/admin dashboards
 * 4. Allowed pages check in global click handler to navigate to 404.html properly
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Premium Validation CSS Styles Dynamically
    const style = document.createElement("style");
    style.textContent = `
        /* Live Validation Styling */
        .auth-input-wrapper input.is-valid,
        .form-group input.is-valid,
        .form-group-input input.is-valid,
        .form-group-input textarea.is-valid,
        .input-icon-wrapper input.is-valid,
        .input-icon-wrapper select.is-valid,
        input.is-valid,
        select.is-valid,
        textarea.is-valid {
            border-color: #10B981 !important; /* Premium green matching theme */
            background-color: rgba(16, 185, 129, 0.03) !important;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08) !important;
        }

        .auth-input-wrapper input.is-invalid,
        .form-group input.is-invalid,
        .form-group-input input.is-invalid,
        .form-group-input textarea.is-invalid,
        .input-icon-wrapper input.is-invalid,
        .input-icon-wrapper select.is-invalid,
        input.is-invalid,
        select.is-invalid,
        textarea.is-invalid {
            border-color: #EF4444 !important; /* Theme warning red */
            background-color: rgba(239, 68, 68, 0.03) !important;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08) !important;
        }

        /* Error Label styling */
        .validation-error {
            display: block;
            font-size: 11px;
            font-weight: 600;
            color: #EF4444;
            margin-top: 6px;
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transform: translateY(-5px);
            transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
            pointer-events: none;
            text-align: left;
            width: 100%;
            word-break: break-word;
            box-sizing: border-box;
            clear: both;
        }

        /* Shake animation for invalid fields */
        @keyframes fieldShake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
        }

        .is-invalid-shake {
            animation: fieldShake 0.4s ease-in-out;
        }

        /* Premium Success Modal Overlay */
        .success-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(4, 31, 24, 0.95);
            backdrop-filter: blur(12px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
        }

        .success-overlay.is-active {
            opacity: 1;
            pointer-events: all;
        }

        .success-card {
            background: #FFFFFF;
            width: 90%;
            max-width: 440px;
            padding: 3rem 2rem;
            border-radius: 24px;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            transform: scale(0.85);
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .success-overlay.is-active .success-card {
            transform: scale(1);
        }

        .success-icon-wrap {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.1);
            color: #10B981;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
        }

        .success-icon-wrap svg {
            width: 36px;
            height: 36px;
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            transition: stroke-dashoffset 0.8s ease 0.2s;
        }

        .success-overlay.is-active svg {
            stroke-dashoffset: 0;
        }

        .success-card h3 {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            color: #0D2119;
            margin-bottom: 0.75rem;
        }

        .success-card p {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #5A7A6F;
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .success-close-btn {
            background: #094B3C;
            color: #FFFFFF;
            border: none;
            padding: 0.85rem 2rem;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 700;
            font-size: 0.85rem;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
        }

        .success-close-btn:hover {
            background: #059669;
            transform: translateY(-2px);
        }

        /* Toast notification */
        .premium-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #041F18;
            color: #ffffff;
            padding: 16px 24px;
            border-radius: 12px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 13px;
            font-weight: 700;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
        }

        .premium-toast.show {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
        }

        .premium-toast-icon {
            color: #10B981;
            font-size: 15px;
            display: inline-flex;
            align-items: center;
        }
    `;
    document.head.appendChild(style);

    // 2. Build Modal Overlay elements dynamically in DOM
    const genericOverlay = document.createElement("div");
    genericOverlay.className = "success-overlay";
    genericOverlay.id = "stackly-success-overlay";
    genericOverlay.innerHTML = `
        <div class="success-card">
            <div class="success-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h3 id="overlay-title">Action Successful</h3>
            <p id="overlay-message">Your details have been successfully processed.</p>
            <button class="success-close-btn" id="overlay-close-btn">Continue</button>
        </div>
    `;
    document.body.appendChild(genericOverlay);

    const closeBtn = document.getElementById("overlay-close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            genericOverlay.classList.remove("is-active");
            document.body.style.overflow = "";
            const redirectUrl = genericOverlay.dataset.redirect;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        });
    }

    // Function to show success modal
    const showSuccessModal = (title, message, redirectUrl = null) => {
        document.getElementById("overlay-title").textContent = title;
        document.getElementById("overlay-message").textContent = message;
        genericOverlay.dataset.redirect = redirectUrl || "";
        genericOverlay.classList.add("is-active");
        document.body.style.overflow = "hidden";
    };

    // Function to show inline success message
    const showInlineSuccess = (form, message) => {
        const existing = form.querySelector(".inline-success-alert");
        if (existing) {
            existing.remove();
        }

        const alertDiv = document.createElement("div");
        alertDiv.className = "inline-success-alert";
        alertDiv.style.cssText = `
            margin-top: 20px;
            padding: 15px 20px;
            background: rgba(16, 185, 129, 0.1);
            color: #065F46;
            border-left: 5px solid #10B981;
            border-radius: 4px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 600;
            font-size: 14px;
            text-align: left;
            width: 100%;
            grid-column: 1 / -1;
            box-sizing: border-box;
            opacity: 0;
            transition: opacity 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        alertDiv.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="flex-shrink: 0; color: #10B981;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>${message}</span>
        `;
        
        form.appendChild(alertDiv);
        
        alertDiv.offsetHeight;
        alertDiv.style.opacity = "1";
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => {
            alertDiv.style.opacity = "0";
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        }, 8000);
    };

    // Function to show toast
    const showToast = (message) => {
        let toast = document.getElementById("stackly-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "stackly-toast";
            toast.className = "premium-toast";
            toast.innerHTML = `
                <span class="premium-toast-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </span>
                <span class="toast-msg"></span>
            `;
            document.body.appendChild(toast);
        }
        toast.querySelector(".toast-msg").textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    };

    // Helper functions for validation
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email.trim());
    };

    const validatePhone = (phone) => {
        const regex = /^\+?[0-9\s\-()]{7,15}$/;
        return regex.test(phone.trim());
    };

    const validatePasswordStrength = (pwd) => {
        return pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd);
    };

    const addErrorMsgElement = (inputEl, errorMsg) => {
        let parent = inputEl.parentElement;
        if (parent && (parent.classList.contains("input-icon-wrapper") || parent.classList.contains("auth-input-wrapper"))) {
            parent = parent.parentElement;
        }
        let errSpan = parent.querySelector(".validation-error");
        if (!errSpan) {
            errSpan = document.createElement("span");
            errSpan.className = "validation-error";
            parent.appendChild(errSpan);
        }
        errSpan.textContent = errorMsg;
        return errSpan;
    };

    const checkField = (input, validateFn, errorMsg) => {
        if (!input) return true;
        const val = input.type === "checkbox" ? input.checked : input.value;
        const isValid = validateFn(val);
        const errSpan = addErrorMsgElement(input, errorMsg);
        
        if (!isValid) {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
            if (errSpan) {
                errSpan.style.display = "block";
                errSpan.style.opacity = "1";
                errSpan.style.maxHeight = "50px";
                errSpan.style.transform = "translateY(0)";
            }
            return false;
        } else {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
            if (errSpan) {
                errSpan.style.opacity = "0";
                errSpan.style.maxHeight = "0";
                errSpan.style.transform = "translateY(-5px)";
            }
            return true;
        }
    };

    // Generic form initialization
    const registerLiveValidation = (inputEl, validateFn, errorMsg) => {
        if (!inputEl) return;
        
        const performVal = () => checkField(inputEl, validateFn, errorMsg);
        
        inputEl.addEventListener("blur", performVal);
        inputEl.addEventListener("input", () => {
            if (inputEl.classList.contains("is-invalid") || inputEl.classList.contains("is-valid")) {
                performVal();
            }
        });
        if (inputEl.tagName === "SELECT") {
            inputEl.addEventListener("change", performVal);
        }
        
        inputEl.triggerVal = performVal;
    };

    // Setup input validation bindings on all visible page forms
    const setupAllFormsValidation = () => {
        // 1. Contact Forms (.contact-form, #contactPageForm, #contact-page-form)
        const contactForms = document.querySelectorAll(".contact-form, #contactPageForm, #contact-page-form");
        contactForms.forEach(form => {
            const nameInput = form.querySelector('#contactName, #contact-name, input[name="name"], input[placeholder*="Name"]');
            const emailInput = form.querySelector('#contactEmail, #contact-email, input[type="email"]');
            const phoneInput = form.querySelector('#contactPhone, #contact-phone, input[type="tel"]');
            const cityInput = form.querySelector('#contactCity, #contact-city, input[placeholder*="City"], input[placeholder*="Zip"]');
            const companyInput = form.querySelector('#contactCompany, input[placeholder*="Company"]');
            const msgTextarea = form.querySelector('#contactMessage, #contact-message, textarea');

            registerLiveValidation(nameInput, val => val.trim().length >= 2, "Full Name is required (min 2 letters).");
            registerLiveValidation(emailInput, val => validateEmail(val), "Please enter a valid email address.");
            if (phoneInput) {
                registerLiveValidation(phoneInput, val => validatePhone(val), "Please enter a valid 10-digit phone number.");
            }
            if (cityInput) {
                registerLiveValidation(cityInput, val => val.trim().length >= 3, "Property City / Zip is required (min 3 chars).");
            }
            if (companyInput) {
                registerLiveValidation(companyInput, val => val.trim() === "" || val.trim().length >= 2, "Company name must be at least 2 characters.");
            }
            if (msgTextarea) {
                registerLiveValidation(msgTextarea, val => val.trim() === "" || val.trim().length >= 5, "Please enter your message (min 5 characters).");
            }

            form.removeAttribute("onsubmit");
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                let isValid = true;
                
                const inputsToValidate = [nameInput, emailInput, phoneInput, cityInput, companyInput, msgTextarea].filter(Boolean);
                inputsToValidate.forEach(inp => {
                    if (inp && typeof inp.triggerVal === "function") {
                        if (!inp.triggerVal()) isValid = false;
                    }
                });

                if (isValid) {
                    showSuccessModal("Consultation Request Confirmed!", "Thank you for reaching out to Stackly. A Salem clean energy specialist will contact you with your custom solar blueprint within 24 hours.");
                    form.reset();
                    inputsToValidate.forEach(inp => {
                        if (inp) inp.classList.remove("is-valid", "is-invalid");
                    });
                } else {
                    form.classList.add("is-invalid-shake");
                    setTimeout(() => form.classList.remove("is-invalid-shake"), 400);
                }
            });
        });

        // 2. Newsletter Subscription Forms (.newsletter-form-inline, #newsletter-form, .newsletter-form)
        const newsletterForms = document.querySelectorAll(".newsletter-form-inline, #newsletter-form, .newsletter-form");
        newsletterForms.forEach(form => {
            const emailInput = form.querySelector('input[type="email"]');
            
            registerLiveValidation(emailInput, val => validateEmail(val), "Please enter a valid email address.");

            form.addEventListener("submit", (e) => {
                e.preventDefault();
                
                if (emailInput && typeof emailInput.triggerVal === "function") {
                    const isValid = emailInput.triggerVal();
                    if (isValid) {
                        showSuccessModal("Subscription Active", "You have successfully subscribed to the monthly Stackly Clean Energy Chronicle!");
                        form.reset();
                        emailInput.classList.remove("is-valid", "is-invalid");
                    } else {
                        form.classList.add("is-invalid-shake");
                        setTimeout(() => form.classList.remove("is-invalid-shake"), 400);
                    }
                }
            });
        });

        // 3. Login Form Custom handling
        const loginForm = document.getElementById("loginForm") || document.getElementById("login-page-form") || document.querySelector(".auth-form");
        if (loginForm && window.location.pathname.includes("login.html")) {
            const roleSelect = document.getElementById("loginRole") || document.getElementById("login-role");
            const emailInput = document.getElementById("loginEmail") || document.getElementById("login-email") || loginForm.querySelector('input[type="email"]');
            const passwordInput = document.getElementById("loginPassword") || document.getElementById("login-password") || loginForm.querySelector('input[type="password"]');

            if (roleSelect) {
                registerLiveValidation(roleSelect, val => val !== "", "Please select your role.");
            }
            if (emailInput) {
                registerLiveValidation(emailInput, val => validateEmail(val), "Please enter a valid email address.");
            }
            if (passwordInput) {
                registerLiveValidation(passwordInput, val => val.length >= 6, "Password must be at least 6 characters.");
            }

            loginForm.removeAttribute("onsubmit");
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                let isValid = true;

                [roleSelect, emailInput, passwordInput].filter(Boolean).forEach(inp => {
                    if (inp && typeof inp.triggerVal === "function") {
                        if (!inp.triggerVal()) isValid = false;
                    }
                });

                if (isValid) {
                    const email = emailInput ? emailInput.value.trim() : "";
                    
                    // Determine role from select, active button, or email contents
                    let role = "user";
                    if (roleSelect && roleSelect.value) {
                        role = roleSelect.value;
                    } else {
                        const activeBtn = document.querySelector("#role-selector .role-btn.active") || document.querySelector(".role-btn.active");
                        if (activeBtn && activeBtn.dataset.role) {
                            role = activeBtn.dataset.role;
                        } else if (email.toLowerCase().includes("admin")) {
                            role = "admin";
                        }
                    }

                    localStorage.setItem("userEmail", email);
                    localStorage.setItem("email", email);
                    localStorage.setItem("currentUserEmail", email);
                    localStorage.setItem("currentUserRole", role);
                    
                    const mockName = email.split('@')[0].replace(/[._]/g, ' ');
                    localStorage.setItem("name", mockName.charAt(0).toUpperCase() + mockName.slice(1));

                    showToast("Authentication Successful!");
                    
                    setTimeout(() => {
                        if (role === "administrator" || role === "admin" || email.toLowerCase().includes("admin")) {
                            window.location.href = "admin dashboard.html";
                        } else {
                            window.location.href = "user dashboard.html";
                        }
                    }, 800);
                } else {
                    loginForm.classList.add("is-invalid-shake");
                    setTimeout(() => loginForm.classList.remove("is-invalid-shake"), 400);
                }
            });
        }

        // 4. Sign-up Form Custom handling
        const signupForm = document.getElementById("signupForm") || document.getElementById("signup-page-form") || (window.location.pathname.includes("signup.html") && document.querySelector(".auth-form"));
        if (signupForm && window.location.pathname.includes("signup.html")) {
            const nameInput = document.getElementById("signupName") || document.getElementById("signup-name") || signupForm.querySelector('input[placeholder*="Name"], input[id*="name"]');
            const emailInput = document.getElementById("signupEmail") || document.getElementById("signup-email") || signupForm.querySelector('input[type="email"]');
            const phoneInput = document.getElementById("signupPhone") || document.getElementById("signup-phone") || signupForm.querySelector('input[type="tel"]');
            const roleSelect = document.getElementById("signupRole") || document.getElementById("signup-role");
            const passwordInput = document.getElementById("signupPassword") || document.getElementById("signup-password") || signupForm.querySelector('input[type="password"]');
            const confirmPasswordInput = document.getElementById("signupConfirmPassword") || document.getElementById("signup-confirm-password");
            const agreeCheckbox = document.getElementById("signupAgree") || document.getElementById("terms-check") || signupForm.querySelector('input[type="checkbox"]');

            if (nameInput) {
                registerLiveValidation(nameInput, val => {
                    const nameVal = val.trim();
                    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
                    return nameVal.length >= 3 && nameRegex.test(nameVal);
                }, "Full Name must be at least 3 characters and contain only letters.");
            }
            if (emailInput) {
                registerLiveValidation(emailInput, val => validateEmail(val), "Please enter a valid email address.");
            }
            if (phoneInput) {
                registerLiveValidation(phoneInput, val => validatePhone(val), "Please enter a valid phone number.");
            }
            if (roleSelect) {
                registerLiveValidation(roleSelect, val => val !== "", "Please select your role.");
            }
            if (passwordInput) {
                registerLiveValidation(passwordInput, val => validatePasswordStrength(val), "Password must be min 8 chars with letter, number, and symbol.");
            }
            if (confirmPasswordInput && passwordInput) {
                registerLiveValidation(confirmPasswordInput, val => val === passwordInput.value, "Passwords do not match.");
                passwordInput.addEventListener("input", () => {
                    if (confirmPasswordInput.value !== "") {
                        checkField(confirmPasswordInput, val => val === passwordInput.value, "Passwords do not match.");
                    }
                });
            }
            if (agreeCheckbox) {
                registerLiveValidation(agreeCheckbox, checked => checked === true, "You must agree to the terms.");
            }

            signupForm.removeAttribute("onsubmit");
            signupForm.addEventListener("submit", (e) => {
                e.preventDefault();
                let isValid = true;

                [nameInput, emailInput, phoneInput, roleSelect, passwordInput, confirmPasswordInput, agreeCheckbox].filter(Boolean).forEach(inp => {
                    if (inp && typeof inp.triggerVal === "function") {
                        if (!inp.triggerVal()) isValid = false;
                    }
                });

                if (isValid) {
                    const email = emailInput ? emailInput.value.trim() : "";
                    const name = nameInput ? nameInput.value.trim() : "";
                    localStorage.setItem("userEmail", email);
                    localStorage.setItem("email", email);
                    localStorage.setItem("currentUserEmail", email);
                    if (name) localStorage.setItem("name", name);
                    showSuccessModal("Account Created", "Your solar portal account was successfully created! Redirecting to login...", "login.html");
                } else {
                    signupForm.classList.add("is-invalid-shake");
                    setTimeout(() => signupForm.classList.remove("is-invalid-shake"), 400);
                }
            });
        }

        // 5. User Profile Form Validation (on User Dashboard)
        const saveProfileBtn = document.getElementById("saveProfileBtn");
        if (saveProfileBtn) {
            const firstNameInput = document.getElementById("profileFirstName");
            const lastNameInput = document.getElementById("profileLastName");
            const emailInput = document.getElementById("profileEmailInput");
            const phoneInput = document.getElementById("profilePhone");
            const locationInput = document.getElementById("profileLocation");
            const timezoneInput = document.getElementById("profileTimeZone");

            registerLiveValidation(firstNameInput, val => val.trim().length >= 2, "First Name is required (min 2 chars).");
            registerLiveValidation(lastNameInput, val => val.trim().length >= 2, "Last Name is required (min 2 chars).");
            registerLiveValidation(emailInput, val => validateEmail(val), "Please enter a valid email address.");
            registerLiveValidation(phoneInput, val => validatePhone(val), "Please enter a valid phone number.");
            registerLiveValidation(locationInput, val => val.trim().length >= 3, "Location is required (min 3 chars).");
            registerLiveValidation(timezoneInput, val => val.trim().length >= 3, "Time Zone is required.");

            saveProfileBtn.removeAttribute("onclick");
            saveProfileBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let isValid = true;

                [firstNameInput, lastNameInput, emailInput, phoneInput, locationInput, timezoneInput].forEach(inp => {
                    if (inp && typeof inp.triggerVal === "function") {
                        if (!inp.triggerVal()) isValid = false;
                    }
                });

                if (isValid) {
                    const newEmail = emailInput.value.trim();
                    const newName = firstNameInput.value.trim() + " " + lastNameInput.value.trim();

                    localStorage.setItem('userEmail', newEmail);
                    localStorage.setItem('email', newEmail);
                    localStorage.setItem('name', newName);

                    const profileEmailDisplay = document.getElementById("profileEmailDisplay");
                    if (profileEmailDisplay) profileEmailDisplay.textContent = newEmail;

                    const heroWelcomeName = document.getElementById("heroWelcomeName");
                    if (heroWelcomeName) heroWelcomeName.textContent = "Welcome back, " + firstNameInput.value.trim() + "!";

                    const timeGreeting = document.getElementById("timeGreeting");
                    if (timeGreeting) {
                        const hour = new Date().getHours();
                        const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
                        timeGreeting.textContent = greeting + ", " + firstNameInput.value.trim() + "!";
                    }

                    const sidebarUserName = document.getElementById("sidebarUserName");
                    if (sidebarUserName) sidebarUserName.textContent = newName;

                    const suAvatar = document.querySelector(".su-avatar");
                    if (suAvatar) {
                        suAvatar.textContent = (firstNameInput.value.charAt(0) + lastNameInput.value.charAt(0)).toUpperCase();
                    }

                    showToast("Profile Settings Saved!");
                    
                    [firstNameInput, lastNameInput, emailInput, phoneInput, locationInput, timezoneInput].forEach(inp => {
                        if (inp) inp.classList.remove("is-valid", "is-invalid");
                    });
                } else {
                    const card = saveProfileBtn.closest(".card");
                    if (card) {
                        card.classList.add("is-invalid-shake");
                        setTimeout(() => card.classList.remove("is-invalid-shake"), 400);
                    }
                }
            });
        }

        // 5a. Change Password Form Validation (User Dashboard)
        const savePasswordBtn = document.getElementById("savePasswordBtn");
        if (savePasswordBtn) {
            const currentPassword = document.getElementById("profileCurrentPassword");
            const newPassword = document.getElementById("profileNewPassword");
            const confirmPassword = document.getElementById("profileConfirmPassword");

            registerLiveValidation(currentPassword, val => val.length >= 8, "Current Password must be at least 8 characters.");
            registerLiveValidation(newPassword, val => validatePasswordStrength(val), "Password must be min 8 chars and include a letter, a number, and a symbol.");
            registerLiveValidation(confirmPassword, val => val === newPassword.value, "Passwords do not match.");

            newPassword.addEventListener("input", () => {
                if (confirmPassword.value !== "") {
                    checkField(confirmPassword, val => val === newPassword.value, "Passwords do not match.");
                }
            });

            savePasswordBtn.removeAttribute("onclick");
            savePasswordBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let isValid = true;

                [currentPassword, newPassword, confirmPassword].forEach(inp => {
                    if (inp && typeof inp.triggerVal === "function") {
                        if (!inp.triggerVal()) isValid = false;
                    }
                });

                if (isValid) {
                    showToast("Password Updated Successfully!");
                    [currentPassword, newPassword, confirmPassword].forEach(inp => {
                        if (inp) {
                            inp.value = "";
                            inp.classList.remove("is-valid", "is-invalid");
                        }
                    });
                } else {
                    const card = savePasswordBtn.closest(".card");
                    if (card) {
                        card.classList.add("is-invalid-shake");
                        setTimeout(() => card.classList.remove("is-invalid-shake"), 400);
                    }
                }
            });
        }

        // 5b. Support Ticket Form Validation (User Dashboard)
        const submitTicketBtn = document.getElementById("submitTicketBtn");
        if (submitTicketBtn) {
            const ticketSubject = document.getElementById("ticketSubject");
            const ticketCategory = document.getElementById("ticketCategory");
            const ticketDesc = document.getElementById("ticketDesc");

            registerLiveValidation(ticketSubject, val => val.trim().length >= 5, "Subject must be at least 5 characters.");
            registerLiveValidation(ticketCategory, val => val !== "", "Please select a category.");
            registerLiveValidation(ticketDesc, val => val.trim().length >= 15, "Please describe the issue in detail (min 15 chars).");

            submitTicketBtn.removeAttribute("onclick");
            submitTicketBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let isValid = true;

                [ticketSubject, ticketCategory, ticketDesc].forEach(inp => {
                    if (inp && typeof inp.triggerVal === "function") {
                        if (!inp.triggerVal()) isValid = false;
                    }
                });

                if (isValid) {
                    showSuccessModal("Ticket Raised", "Your support ticket has been created successfully. Average response time: 2 hours.");
                    [ticketSubject, ticketCategory, ticketDesc].forEach(inp => {
                        if (inp) {
                            inp.value = "";
                            inp.classList.remove("is-valid", "is-invalid");
                        }
                    });
                } else {
                    const card = submitTicketBtn.closest(".card");
                    if (card) {
                        card.classList.add("is-invalid-shake");
                        setTimeout(() => card.classList.remove("is-invalid-shake"), 400);
                    }
                }
            });
        }

        // 6. Admin settings form in Admin Dashboard
        const saveAdminBtn = document.getElementById("saveAdminBtn");
        if (saveAdminBtn) {
            const adminNameInput = document.getElementById("adminNameInput");
            const adminEmailInput = document.getElementById("adminEmailInput");
            const adminNewPassword = document.getElementById("adminNewPassword");

            registerLiveValidation(adminNameInput, val => val.trim().length >= 2, "Admin Name is required (min 2 chars).");
            registerLiveValidation(adminEmailInput, val => validateEmail(val), "Please enter a valid email address.");
            registerLiveValidation(adminNewPassword, val => val.trim() === "" || validatePasswordStrength(val), "Password must be min 8 chars with letters, numbers, and symbols.");

            saveAdminBtn.removeAttribute("onclick");
            saveAdminBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let isValid = true;

                [adminNameInput, adminEmailInput, adminNewPassword].forEach(inp => {
                    if (inp && typeof inp.triggerVal === "function") {
                        if (!inp.triggerVal()) isValid = false;
                    }
                });

                if (isValid) {
                    const newEmail = adminEmailInput.value.trim();
                    const newName = adminNameInput.value.trim();

                    localStorage.setItem('userEmail', newEmail);
                    localStorage.setItem('email', newEmail);
                    localStorage.setItem('name', newName);

                    const sidebarAdminName = document.getElementById("sidebarAdminName");
                    if (sidebarAdminName) sidebarAdminName.textContent = newName;

                    const sAvatar = document.querySelector(".s-avatar");
                    if (sAvatar) {
                        const parts = newName.split(" ");
                        sAvatar.textContent = (parts[0].charAt(0) + (parts[1] ? parts[1].charAt(0) : "")).toUpperCase();
                    }

                    showToast("Admin Settings Saved!");

                    [adminNameInput, adminEmailInput, adminNewPassword].forEach(inp => {
                        if (inp) {
                            if (inp.type === "password") inp.value = "";
                            inp.classList.remove("is-valid", "is-invalid");
                        }
                    });
                } else {
                    const card = saveAdminBtn.closest(".card");
                    if (card) {
                        card.classList.add("is-invalid-shake");
                        setTimeout(() => card.classList.remove("is-invalid-shake"), 400);
                    }
                }
            });
        }

        // 6b. Admin API Configuration Form Validation
        const saveApiBtn = document.getElementById("saveApiBtn");
        if (saveApiBtn) {
            const settingsWebhookUrl = document.getElementById("settingsWebhookUrl");
            const settingsRateLimit = document.getElementById("settingsRateLimit");

            registerLiveValidation(settingsWebhookUrl, val => val.trim() === "" || val.startsWith("http://") || val.startsWith("https://"), "Please enter a valid Webhook URL.");
            registerLiveValidation(settingsRateLimit, val => parseInt(val) > 0, "Rate Limit must be a positive integer.");

            saveApiBtn.removeAttribute("onclick");
            saveApiBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let isValid = true;

                [settingsWebhookUrl, settingsRateLimit].forEach(inp => {
                    if (inp && typeof inp.triggerVal === "function") {
                        if (!inp.triggerVal()) isValid = false;
                    }
                });

                if (isValid) {
                    showToast("API Configuration Updated!");
                    [settingsWebhookUrl, settingsRateLimit].forEach(inp => {
                        if (inp) inp.classList.remove("is-valid", "is-invalid");
                    });
                } else {
                    const card = saveApiBtn.closest(".card");
                    if (card) {
                        card.classList.add("is-invalid-shake");
                        setTimeout(() => card.classList.remove("is-invalid-shake"), 400);
                    }
                }
            });
        }
    };

    // Load Localized State into Inputs & Welcomes dynamically
    const loadStateFromLocalStorage = () => {
        const storedEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
        const storedName = localStorage.getItem('name');

        // User Dashboard loading
        const curPath = decodeURIComponent(window.location.pathname).toLowerCase();
        if (curPath.includes("user-dashboard") || curPath.includes("user dashboard")) {
            if (storedEmail) {
                const profileEmailInput = document.getElementById("profileEmailInput");
                if (profileEmailInput) profileEmailInput.value = storedEmail;

                const profileEmailDisplay = document.getElementById("profileEmailDisplay");
                if (profileEmailDisplay) profileEmailDisplay.textContent = storedEmail;

                const userProfileEmail = document.getElementById("user-profile-email");
                if (userProfileEmail) userProfileEmail.textContent = storedEmail;
            }

            if (storedName) {
                const cleanName = storedName.replace(/[^a-zA-Z\s]/g, "");
                const parts = cleanName.split(" ");
                const firstName = parts[0];
                const lastName = parts[1] || "";

                const firstNameInput = document.getElementById("profileFirstName");
                if (firstNameInput) firstNameInput.value = firstName;

                const lastNameInput = document.getElementById("profileLastName");
                if (lastNameInput) lastNameInput.value = lastName;

                const sidebarUserName = document.getElementById("sidebarUserName");
                if (sidebarUserName) sidebarUserName.textContent = cleanName;

                const userProfileName = document.getElementById("user-profile-name");
                if (userProfileName) userProfileName.textContent = cleanName;

                const heroWelcomeName = document.getElementById("heroWelcomeName");
                if (heroWelcomeName) heroWelcomeName.textContent = "Welcome back, " + firstName + "!";

                const timeGreeting = document.getElementById("timeGreeting");
                if (timeGreeting) {
                    const hour = new Date().getHours();
                    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
                    timeGreeting.textContent = greeting + ", " + firstName + "!";
                }

                const suAvatar = document.querySelector(".su-avatar");
                if (suAvatar) {
                    suAvatar.textContent = (firstName.charAt(0) + (lastName ? lastName.charAt(0) : "")).toUpperCase();
                }
            }
        }

        // Admin Dashboard loading
        if (curPath.includes("admin-dashboard") || curPath.includes("admin dashboard")) {
            if (storedEmail) {
                const adminEmailInput = document.getElementById("adminEmailInput");
                if (adminEmailInput) adminEmailInput.value = storedEmail;

                const adminProfileRole = document.getElementById("admin-profile-role");
                if (adminProfileRole) adminProfileRole.textContent = storedEmail;
            }

            if (storedName) {
                const cleanName = storedName.replace(/[^a-zA-Z\s]/g, "");
                const adminNameInput = document.getElementById("adminNameInput");
                if (adminNameInput) adminNameInput.value = cleanName;

                const sidebarAdminName = document.getElementById("sidebarAdminName");
                if (sidebarAdminName) sidebarAdminName.textContent = cleanName;

                const adminProfileName = document.getElementById("admin-profile-name");
                if (adminProfileName) adminProfileName.textContent = cleanName;

                const sAvatar = document.querySelector(".s-avatar");
                if (sAvatar) {
                    const parts = cleanName.split(" ");
                    sAvatar.textContent = (parts[0].charAt(0) + (parts[1] ? parts[1].charAt(0) : "")).toUpperCase();
                }
            }
        }
    };

    // Setup input character restrictions
    const enforceRestrictions = () => {
        const nameInputs = document.querySelectorAll(
            'input[id*="Name"], input[id*="name"], input[placeholder*="Name"], input[placeholder*="name"]'
        );
        nameInputs.forEach(input => {
            input.addEventListener("input", (e) => {
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const oldVal = e.target.value;
                const newVal = oldVal.replace(/[^a-zA-Z\s]/g, "");
                if (newVal !== oldVal) {
                    e.target.value = newVal;
                    const diff = oldVal.length - newVal.length;
                    e.target.setSelectionRange(start - diff, end - diff);
                }
            });
        });

        const phoneInputs = document.querySelectorAll(
            'input[type="tel"], input[id*="phone"], input[id*="Phone"], input[placeholder*="Phone"], input[placeholder*="phone"]'
        );
        phoneInputs.forEach(input => {
            input.addEventListener("input", (e) => {
                const oldVal = e.target.value;
                let newVal = oldVal.replace(/[^0-9]/g, "");
                if (newVal.length > 10) {
                    newVal = newVal.substring(0, 10);
                }
                if (newVal !== oldVal) {
                    e.target.value = newVal;
                }
            });
        });
    };

    // GSAP Text Animations for Heading Tags Across Website
    const initGsapHeadingAnimations = () => {
        if (typeof gsap === "undefined") return;

        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }

        const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headings.forEach((heading) => {
            if (heading.dataset.gsapInit) return;
            heading.dataset.gsapInit = "true";

            const text = heading.innerText ? heading.innerText.trim() : "";
            if (text && heading.children.length === 0) {
                const words = text.split(/(\s+)/);
                heading.innerHTML = "";

                words.forEach((word) => {
                    if (word.trim() === "") {
                        heading.appendChild(document.createTextNode(word));
                    } else {
                        const wordSpan = document.createElement("span");
                        wordSpan.style.display = "inline-block";
                        wordSpan.style.perspective = "600px";
                        wordSpan.style.overflow = "hidden";
                        wordSpan.style.verticalAlign = "bottom";

                        const innerSpan = document.createElement("span");
                        innerSpan.className = "gsap-heading-word";
                        innerSpan.style.display = "inline-block";
                        innerSpan.style.transformOrigin = "50% 50% -100px";
                        innerSpan.textContent = word;

                        wordSpan.appendChild(innerSpan);
                        heading.appendChild(wordSpan);
                    }
                });

                const targetWords = heading.querySelectorAll(".gsap-heading-word");

                if (typeof ScrollTrigger !== "undefined") {
                    gsap.from(targetWords, {
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 88%",
                            toggleActions: "play none none none"
                        },
                        y: 70,
                        opacity: 0,
                        rotateX: -85,
                        duration: 0.85,
                        ease: "power4.out",
                        stagger: 0.04
                    });
                } else {
                    gsap.from(targetWords, {
                        y: 70,
                        opacity: 0,
                        rotateX: -85,
                        duration: 0.85,
                        ease: "power4.out",
                        stagger: 0.04
                    });
                }
            } else {
                heading.style.perspective = "600px";
                if (typeof ScrollTrigger !== "undefined") {
                    gsap.from(heading, {
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 88%",
                            toggleActions: "play none none none"
                        },
                        y: 40,
                        opacity: 0,
                        rotateX: -30,
                        duration: 0.85,
                        ease: "power3.out"
                    });
                } else {
                    gsap.from(heading, {
                        y: 40,
                        opacity: 0,
                        rotateX: -30,
                        duration: 0.85,
                        ease: "power3.out"
                    });
                }
            }
        });
    };

    // Setup preloader behavior
    const setupPreloader = () => {
        document.body.classList.add("preloader-active");
        const preloader = document.getElementById("preloader");
        const bar = document.getElementById("preloader-bar");
        if (!preloader || !bar) {
            document.body.classList.remove("preloader-active");
            initGsapHeadingAnimations();
            return;
        }

        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress < 85) {
                progress += Math.floor(Math.random() * 12) + 5;
                if (progress > 85) progress = 85;
                bar.style.width = progress + "%";
            }
        }, 80);

        const completePreloader = () => {
            clearInterval(progressInterval);
            bar.style.width = "100%";
            
            setTimeout(() => {
                if (typeof gsap !== "undefined") {
                    gsap.to(preloader, {
                        opacity: 0,
                        duration: 0.55,
                        ease: "power2.out",
                        onComplete: () => {
                            preloader.style.display = "none";
                            preloader.style.visibility = "hidden";
                            document.body.classList.remove("preloader-active");
                            initGsapHeadingAnimations();
                        }
                    });
                } else {
                    preloader.style.opacity = "0";
                    setTimeout(() => {
                        preloader.style.display = "none";
                        preloader.style.visibility = "hidden";
                        document.body.classList.remove("preloader-active");
                        initGsapHeadingAnimations();
                    }, 550);
                }
            }, 250);
        };

        if (document.readyState === "complete") {
            completePreloader();
        } else {
            window.addEventListener("load", completePreloader);
        }
    };

    // Initialize forms, state & preloader
    setupAllFormsValidation();
    loadStateFromLocalStorage();
    enforceRestrictions();
    setupPreloader();

    // ================= GLOBAL CLICK-TO-404 NAVIGATOR =================
    document.body.addEventListener("click", (e) => {
        let target = e.target;
        let shouldGoTo404 = false;

        const currentPath = decodeURIComponent(window.location.pathname).toLowerCase();
        const isDashboard = currentPath.includes("dashboard") || currentPath.includes("user dashboard");
        const isAuthPage = currentPath.includes("login.html") || currentPath.includes("signup.html");

        if (isAuthPage) {
            return;
        }

        // The Stackly logo everywhere must navigate to index.html only and never go to 404
        const anchorEl = target.closest ? target.closest("a") : null;
        if (anchorEl) {
            const href = (anchorEl.getAttribute("href") || "").trim();
            const cleanHref = href.split("#")[0].split("?")[0].replace(/^\.\//, "");
            const hasLogo = anchorEl.id === "logo-text" ||
                            anchorEl.classList.contains("brand-logo") ||
                            anchorEl.classList.contains("footer-logo") ||
                            Boolean(anchorEl.querySelector('img[src*="stackly"]'));
            if (cleanHref === "index.html" || hasLogo) {
                return; // Direct native navigation to index.html
            }
        }

        while (target && target !== document.body) {
            if (target.closest) {
                // Ignore interactive controls, toggles, filter buttons, solution sidebar items & modals
                const isIgnored = target.closest("#mobileToggle") !== null ||
                                  target.closest("#mobileMenuBtn") !== null ||
                                  target.closest("#searchToggle") !== null ||
                                  target.closest("#closeSearch") !== null ||
                                  target.closest(".mobile-toggle") !== null ||
                                  target.closest(".faq-item") !== null ||
                                  target.closest(".solutions-sidebar") !== null ||
                                  target.closest(".solutions-sidebar-item") !== null ||
                                  target.closest(".solutions-sidebar-link") !== null ||
                                  target.closest(".filter-btn") !== null ||
                                  target.closest(".resources-filters") !== null ||
                                  target.closest("#viewAllProjectsBtn") !== null ||
                                  target.closest(".search-modal") !== null ||
                                  target.closest(".modal-overlay") !== null;
                if (isIgnored) {
                    shouldGoTo404 = false;
                    break;
                }

            }

            if (isDashboard) {
                // Dashboard specific links, buttons, and clickable icons logic
                const isClickable = target.tagName === "A" || 
                                    target.tagName === "BUTTON" || 
                                    target.getAttribute("role") === "button" ||
                                    target.classList.contains("icon-btn") ||
                                    target.classList.contains("support-card") ||
                                    target.id === "userAvatarBtn";

                if (isClickable) {
                    const href = target.getAttribute("href");
                    const id = target.getAttribute("id");
                    
                    // List of dashboard elements that perform active actions
                    const activeDashboardElements = [
                        "sidebarToggle", 
                        "sidebarToggleMobile", 
                        "dashMobileToggle", 
                        "mobileSidebarClose",
                        "mobile-menu-toggle",
                        "close-mobile-drawer",
                        "mobile-sidebar-drawer",
                        "logout-btn",
                        "notif-btn",
                        "alert-btn",
                        "refresh-telemetry-btn",
                        "export-fleet-btn",
                        "view-fleet-btn",
                        "nav-home", 
                        "nav-usage", 
                        "nav-devices", 
                        "nav-projects-u", 
                        "nav-billing",
                        "nav-transactions", 
                        "nav-savings", 
                        "nav-impact", 
                        "nav-tips", 
                        "nav-notifications",
                        "nav-profile", 
                        "nav-support", 
                        "nav-admin-link",
                        "nav-admin-dash", 
                        "nav-analytics", 
                        "nav-users", 
                        "nav-projects", 
                        "nav-grid",
                        "nav-reports", 
                        "nav-notif", 
                        "nav-settings", 
                        "nav-user-link",
                        "saveProfileBtn", 
                        "savePasswordBtn", 
                        "submitTicketBtn", 
                        "refCopyBtn", 
                        "payBillBtn",
                        "adminRefreshBtn", 
                        "saveAdminBtn", 
                        "regenKeyBtn", 
                        "saveApiBtn",
                        "nav-logout",
                        "nav-logout-admin",
                        "sidebarLogoutBtn",
                        "sidebarAdminLogoutBtn"
                    ];
                    
                    const isToggleOrNav = activeDashboardElements.includes(id) || 
                                          target.classList.contains("sidebar-toggle") ||
                                          target.closest(".sidebar-nav") !== null ||
                                          target.closest("aside") !== null ||
                                          target.closest("nav") !== null ||
                                          target.closest(".logout-icon-btn") !== null ||
                                          target.id === "logout-btn" ||
                                          target.id === "mobile-menu-toggle" ||
                                          target.id === "close-mobile-drawer" ||
                                          (href && href.startsWith("#section-")) ||
                                          (href && href.startsWith("#"));

                    if (isToggleOrNav) {
                        shouldGoTo404 = false;
                    } else if (href && href !== "#") {
                        const cleanHref = decodeURIComponent(href.split("#")[0].split("?")[0].replace(/^\.\//, ''));
                        const allowedHrefs = [
                            "index.html",
                            "about.html",
                            "services.html",
                            "blog.html",
                            "contact.html",
                            "admin-dashboard.html",
                            "admin dashboard.html",
                            "user-dashboard.html",
                            "user dashboard.html",
                            "login.html",
                            "signup.html",
                            "404.html"
                        ];
                        if (allowedHrefs.includes(cleanHref)) {
                            shouldGoTo404 = false;
                        } else {
                            shouldGoTo404 = true;
                        }
                    } else {
                        // Any other placeholder button/link/icon goes to 404
                        shouldGoTo404 = true;
                    }
                    break;
                }
            } else {
                // Non-dashboard standard logic
                if (target.tagName === "A") {
                    const href = target.getAttribute("href");
                    const onclickStr = target.getAttribute("onclick") || "";
                    
                    if (href === "javascript:void(0)" || target.getAttribute("role") === "button" || target.hasAttribute("data-tab") || target.hasAttribute("data-filter")) {
                        shouldGoTo404 = false;
                        break;
                    }

                    if (href && !onclickStr) {
                        if (href.startsWith('#')) {
                            if (href === "#") {
                                shouldGoTo404 = true;
                            } else {
                                const targetEl = document.querySelector(href);
                                if (!targetEl) {
                                    shouldGoTo404 = true;
                                }
                            }
                            break;
                        }

                        const cleanHref = decodeURIComponent(href.split("#")[0].split("?")[0].replace(/^\.\//, ''));
                        const allowedHrefs = [
                            "index.html",
                            "about.html",
                            "services.html",
                            "blog.html",
                            "contact.html",
                            "login.html",
                            "signup.html",
                            "admin-dashboard.html",
                            "admin dashboard.html",
                            "user-dashboard.html",
                            "user dashboard.html",
                            "404.html"
                        ];
                        
                        if (cleanHref === "404.html" || allowedHrefs.includes(cleanHref)) {
                            shouldGoTo404 = false;
                        } else {
                            shouldGoTo404 = true;
                        }
                    } else if (!onclickStr) {
                        shouldGoTo404 = true;
                    }
                    break;
                }

                // Check buttons
                if (target.tagName === "BUTTON") {
                    const isFormRelated = target.type === "submit" || target.closest("form") !== null || target.closest(".search-modal") !== null || target.classList.contains("filter-btn") || target.id === "viewAllProjectsBtn";
                    const onclickStr = target.getAttribute("onclick") || "";
                    
                    if (onclickStr.includes("404.html")) {
                        shouldGoTo404 = true;
                    } else if (!isFormRelated && !onclickStr) {
                        shouldGoTo404 = true;
                    }
                    break;
                }
            }

            target = target.parentElement;
        }

        if (shouldGoTo404) {
            const isNative404Link = e.target.closest("a") && e.target.closest("a").getAttribute("href") === "404.html";
            if (!isNative404Link && !window.location.pathname.includes("404.html")) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "404.html";
            }
        }
    });
});
