<script lang="ts">
    import { authToken } from "$lib/stores/auth";
    import { onMount } from "svelte";

    interface Props {
        clientId: string;
        baseUrl: string;
        onLoginSuccess: () => void;
    }

    let { clientId, baseUrl, onLoginSuccess }: Props = $props();

    let phone = $state("");
    let otp = $state("");
    let step = $state<"phone" | "otp">("phone");
    let loading = $state(false);
    let error = $state("");

    async function sendOtp() {
        if (!phone) return;
        loading = true;
        error = "";
        try {
            const response = await fetch(
                `${baseUrl}/api/method/custom_booking.api.devoteee.login.devoteee_login_req`,
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
                `${baseUrl}/api/method/custom_booking.api.devoteee.login.devoteee_login_req`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone, otp }),
                },
            );
            const data = await response.json();
            if (response.ok) {
                authToken.set(data.message);
                onLoginSuccess();
            } else {
                error = data.message || "Invalid OTP";
            }
        } catch (err) {
            error = "Network error";
        }
        loading = false;
    }

    async function handleGoogleCredentialResponse(response: any) {
        loading = true;
        error = "";
        try {
            const res = await fetch(
                `${baseUrl}/api/method/custom_booking.api.devoteee.login.google_login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: response.credential }),
                },
            );
            const data = await res.json();
            if (res.ok) {
                authToken.set(data.message);
                onLoginSuccess();
            } else {
                error = data.message || "Google login failed";
            }
        } catch (err) {
            error = "Network error";
        }
        loading = false;
    }

    onMount(() => {
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

{#if step === "phone"}
    <div class="max-w-md mx-auto mt-10 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg border border-blue-200">
        <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
        <input
            type="text"
            placeholder="Enter your phone number"
            bind:value={phone}
            class="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {#if error}<p class="text-red-500 mb-4 text-center">{error}</p>{/if}
        <button
            onclick={sendOtp}
            disabled={loading}
            class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all font-medium"
        >
            {loading ? "Sending..." : "Send OTP"}
        </button>
        <div class="mt-6 text-center">
            <p class="text-gray-600 mb-3">Or continue with</p>
            <div id="google-btn" class="flex justify-center"></div>
        </div>
    </div>
{:else}
    <div class="max-w-md mx-auto mt-10 p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg border border-green-200">
        <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Verify OTP</h2>
        <input
            type="text"
            placeholder="Enter 6-digit OTP"
            bind:value={otp}
            class="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
        {#if error}<p class="text-red-500 mb-4 text-center">{error}</p>{/if}
        <button
            onclick={verifyOtp}
            disabled={loading}
            class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all font-medium"
        >
            {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <button
            onclick={() => {
                step = "phone";
                otp = "";
                error = "";
            }}
            class="w-full mt-3 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-all font-medium"
        >
            Back
        </button>
    </div>
{/if}