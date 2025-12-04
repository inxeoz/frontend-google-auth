<script lang="ts">
    interface Props {
        profile: any;
        baseUrl: string;
        token: string;
        onUpdate: (updatedProfile: any) => void;
        onCancel: () => void;
        mode: "profile" | "phone" | "email";
    }

    let { profile, baseUrl, token, onUpdate, onCancel, mode }: Props = $props();

    let editData = $state({ ...profile });
    let newPhone = $state(profile.phone || "");
    let phoneOtp = $state("");
    let phoneStep = $state<"phone" | "otp">("phone");
    let newEmail = $state(profile.email || "");
    let emailOtp = $state("");
    let emailStep = $state<"email" | "otp">("email");
    let loading = $state(false);
    let error = $state("");

    // Remove phone and companion from editData for profile mode
    if (mode === "profile") {
        delete editData.phone;
        delete editData.companion;
    }

    async function updateProfile() {
        if (!token) return;
        loading = true;
        error = "";
        try {
            const response = await fetch(
                `${baseUrl}/api/method/custom_booking.api.devoteee.profile.update_profile`,
                {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editData),
                },
            );
            const data = await response.json();
            if (response.ok) {
                onUpdate(data.message);
            } else {
                error = data.message || "Failed to update profile";
            }
        } catch (err) {
            error = "Network error";
        }
        loading = false;
    }

    async function requestPhoneChange() {
        if (!token) return;
        loading = true;
        error = "";
        try {
            const response = await fetch(
                `${baseUrl}/api/method/custom_booking.api.devoteee.profile.update_cred`,
                {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ phone: newPhone }),
                },
            );
            const data = await response.json();
            if (response.ok) {
                phoneOtp = data.message;
                phoneStep = "otp";
            } else {
                error = data.message || "Failed to request phone change";
            }
        } catch (err) {
            error = "Network error";
        }
        loading = false;
    }

    async function confirmPhoneChange() {
        if (!token) return;
        loading = true;
        error = "";
        try {
            const response = await fetch(
                `${baseUrl}/api/method/custom_booking.api.devoteee.profile.update_cred`,
                {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ phone: newPhone, otp_phone: phoneOtp }),
                },
            );
            const data = await response.json();
            if (response.ok) {
                onUpdate(data.message);
            } else {
                error = data.message || "Failed to update phone";
            }
        } catch (err) {
            error = "Network error";
        }
        loading = false;
    }

    async function requestEmailChange() {
        if (!token) return;
        loading = true;
        error = "";
        try {
            const response = await fetch(
                `${baseUrl}/api/method/custom_booking.api.devoteee.profile.update_cred`,
                {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: newEmail }),
                },
            );
            const data = await response.json();
            if (response.ok) {
                emailOtp = data.message;
                emailStep = "otp";
            } else {
                error = data.message || "Failed to request email change";
            }
        } catch (err) {
            error = "Network error";
        }
        loading = false;
    }

    async function confirmEmailChange() {
        if (!token) return;
        loading = true;
        error = "";
        try {
            const response = await fetch(
                `${baseUrl}/api/method/custom_booking.api.devoteee.profile.update_cred`,
                {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: newEmail, otp_email: emailOtp }),
                },
            );
            const data = await response.json();
            if (response.ok) {
                onUpdate(data.message);
            } else {
                error = data.message || "Failed to update email";
            }
        } catch (err) {
            error = "Network error";
        }
        loading = false;
    }
</script>

<div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow border">
    {#if mode === "profile"}
        <h2 class="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <form onsubmit={updateProfile} class="space-y-4">
            <input
                type="text"
                placeholder="Name"
                bind:value={editData.devoteee_name}
                class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="email"
                placeholder="Email"
                bind:value={editData.email}
                class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <select
                bind:value={editData.gender}
                class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <input
                type="text"
                bind:value={editData.dob}
                class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Date of Birth"
            />
            <input
                type="text"
                placeholder="Aadhar"
                bind:value={editData.aadhar}
                class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="text"
                placeholder="Location"
                bind:value={editData.location}
                class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {#if error}<p class="text-red-500">{error}</p>{/if}
            <div class="flex space-x-3">
                <button
                    type="submit"
                    disabled={loading}
                    class="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update"}
                </button>
                <button
                    type="button"
                    onclick={onCancel}
                    class="flex-1 bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </form>
    {:else if mode === "phone"}
        <h2 class="text-2xl font-bold mb-6 text-center">Change Phone</h2>
        {#if phoneStep === "phone"}
            <div class="space-y-4">
                <input
                    type="text"
                    placeholder="New Phone Number"
                    bind:value={newPhone}
                    class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {#if error}<p class="text-red-500">{error}</p>{/if}
                <div class="flex space-x-3">
                    <button
                        onclick={requestPhoneChange}
                        disabled={loading || !newPhone}
                        class="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                    <button
                        onclick={onCancel}
                        class="flex-1 bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        {:else}
            <div class="space-y-4">
                <input
                    type="text"
                    placeholder="OTP"
                    bind:value={phoneOtp}
                    class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {#if error}<p class="text-red-500">{error}</p>{/if}
                <div class="flex space-x-3">
                    <button
                        onclick={confirmPhoneChange}
                        disabled={loading || !phoneOtp}
                        class="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Phone"}
                    </button>
                    <button
                        onclick={onCancel}
                        class="flex-1 bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        {/if}
    {:else if mode === "email"}
        <h2 class="text-2xl font-bold mb-6 text-center">Change Email</h2>
        {#if emailStep === "email"}
            <div class="space-y-4">
                <input
                    type="email"
                    placeholder="New Email Address"
                    bind:value={newEmail}
                    class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {#if error}<p class="text-red-500">{error}</p>{/if}
                <div class="flex space-x-3">
                    <button
                        onclick={requestEmailChange}
                        disabled={loading || !newEmail}
                        class="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                    <button
                        onclick={onCancel}
                        class="flex-1 bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        {:else}
            <div class="space-y-4">
                <input
                    type="text"
                    placeholder="OTP"
                    bind:value={emailOtp}
                    class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {#if error}<p class="text-red-500">{error}</p>{/if}
                <div class="flex space-x-3">
                    <button
                        onclick={confirmEmailChange}
                        disabled={loading || !emailOtp}
                        class="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Email"}
                    </button>
                    <button
                        onclick={onCancel}
                        class="flex-1 bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        {/if}
    {/if}
</div>