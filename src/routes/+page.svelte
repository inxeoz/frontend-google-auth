<script lang="ts">
    import { authToken, baseUrl } from "$lib/stores/auth";
    import { onMount } from "svelte";

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    let phone = "";
    let otp = "";
    let step: "phone" | "otp" = "phone";
    let loading = false;
    let error = "";
    let profile: any = null;
    let editing = false;
    let editData: any = {};

    let base_url = "http://localhost:8000";
    baseUrl.subscribe((value: string) => (base_url = value));

    async function sendOtp() {
        if (!phone) return;
        loading = true;
        error = "";
        try {
            const response = await fetch(
                `${base_url}/api/method/custom_booking.api.devoteee.login.devoteee_login_req`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone }),
                },
            );
            const data = await response.json();
            if (response.ok) {
                step = "otp";
            } else {
                error = data.message || "Failed to send OTP";
            }
        } catch (err) {
            error = "Network error";
        }
        loading = false;
    }

    async function verifyOtp() {
        if (!otp) return;
        loading = true;
        error = "";
        try {
            const response = await fetch(
                `${base_url}/api/method/custom_booking.api.devoteee.login.devoteee_login_req`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone, otp }),
                },
            );
            const data = await response.json();
            if (response.ok) {
                authToken.set(data.message);
                await loadProfile();
            } else {
                error = data.message || "Invalid OTP";
            }
        } catch (err) {
            error = "Network error";
        }
        loading = false;
    }

    async function loadProfile() {
        const token = $authToken;
        if (!token) return;
        try {
            const response = await fetch(
                `${base_url}/api/method/custom_booking.api.devoteee.profile.profile`,
                {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                },
            );
            const data = await response.json();
            if (response.ok) {
                profile = data.message;
            } else {
                error = data.message || "Failed to load profile";
            }
        } catch (err) {
            error = "Network error";
        }
    }

    async function updateProfile(updatedData: any) {
        const token = $authToken;
        if (!token) return;
        loading = true;
        error = "";
        try {
            const response = await fetch(
                `${base_url}/api/method/custom_booking.api.devoteee.profile.update_profile`,
                {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedData),
                },
            );
            const data = await response.json();
            if (response.ok) {
                profile = data.message;
                editing = false;
            } else {
                error = data.message || "Failed to update profile";
            }
        } catch (err) {
            error = "Network error";
        }
        loading = false;
    }

    function startEdit() {
        editing = true;
        editData = { ...profile };
    }

    function cancelEdit() {
        editing = false;
        editData = {};
    }

    async function handleGoogleCredentialResponse(response: any) {
        loading = true;
        error = "";
        try {
            const res = await fetch(`${base_url}/api/method/custom_booking.api.devoteee.login.google_login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: response.credential }),
            });
            const data = await res.json();
            if (res.ok) {
                authToken.set(data.message);
                await loadProfile();
            } else {
                error = data.message || "Google login failed";
            }
        } catch (err) {
            error = "Network error";
        }
        loading = false;
    }

    onMount(() => {
        if ($authToken) {
            loadProfile();
        }

        // Initialize Google Sign-In
        if (clientId && (window as any).google) {
            (window as any).google.accounts.id.initialize({
                client_id: clientId,
                callback: handleGoogleCredentialResponse,
            });

            (window as any).google.accounts.id.renderButton(
                document.getElementById("google-btn"),
                {
                    theme: "outline",
                    size: "large",
                },
            );
        }
    });
</script>

{#if !$authToken}
    {#if step === "phone"}
        <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4">Login</h2>
            <input
                type="text"
                placeholder="Phone Number"
                bind:value={phone}
                class="w-full p-2 border rounded mb-4"
            />
            {#if error}<p class="text-red-500 mb-4">{error}</p>{/if}
            <button
                on:click={sendOtp}
                disabled={loading}
                class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <div class="mt-4 text-center">
                <p class="text-gray-600 mb-2">Or</p>
                <div id="google-btn"></div>
            </div>
        </div>
    {:else}
        <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4">Enter OTP</h2>
            <input
                type="text"
                placeholder="OTP"
                bind:value={otp}
                class="w-full p-2 border rounded mb-4"
            />
            {#if error}<p class="text-red-500 mb-4">{error}</p>{/if}
            <button
                on:click={verifyOtp}
                disabled={loading}
                class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
                on:click={() => {
                    step = "phone";
                    otp = "";
                    error = "";
                }}
                class="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
                Back
            </button>
        </div>
    {/if}
{:else}
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Profile</h2>
        {#if profile}
            {#if editing}
                <form
                    on:submit|preventDefault={() => updateProfile(editData)}
                    class="space-y-4"
                >
                    <input
                        type="text"
                        placeholder="Name"
                        bind:value={editData.devoteee_name}
                        class="w-full p-2 border rounded"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        bind:value={editData.email}
                        class="w-full p-2 border rounded"
                    />
                    <select
                        bind:value={editData.gender}
                        class="w-full p-2 border rounded"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <input
                        type="date"
                        bind:value={editData.dob}
                        class="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Aadhar"
                        bind:value={editData.aadhar}
                        class="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        bind:value={editData.location}
                        class="w-full p-2 border rounded"
                    />
                    <div class="flex space-x-2">
                        <button
                            type="submit"
                            disabled={loading}
                            class="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                        <button
                            type="button"
                            on:click={cancelEdit}
                            class="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            {:else}
                <p><strong>Name:</strong> {profile.devoteee_name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Gender:</strong> {profile.gender}</p>
                <p><strong>DOB:</strong> {profile.dob}</p>
                <p><strong>Aadhar:</strong> {profile.aadhar}</p>
                <p><strong>Location:</strong> {profile.location}</p>
                <div class="flex space-x-2 mt-4">
                    <button
                        on:click={startEdit}
                        class="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Edit Profile
                    </button>
                    <button
                        on:click={() => authToken.set(null)}
                        class="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            {/if}
        {:else}
            <p>Loading profile...</p>
        {/if}
        {#if error}<p class="text-red-500 mt-4">{error}</p>{/if}
    </div>
{/if}
