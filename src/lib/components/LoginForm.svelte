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
                    theme: "dark",
                    size: "large",
                },
            );
        }
    });

</script>

    {#if step === "phone"}
        <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow border">
            <h2 class="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
            <input
                type="text"
                placeholder="Enter your phone number"
                bind:value={phone}
                class="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-blue-500"
            />
            {#if error}<p class="text-red-500 mb-4 text-center">{error}</p>{/if}
            <button
                onclick={sendOtp}
                disabled={loading}
                class="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
             >
                 {loading ? "Sending..." : "Send OTP"}
             </button>
             <div class="mt-6 text-center">
                 <p class="mb-3">Or continue with</p>
                 <div id="google-btn" class="flex justify-center"></div>
             </div>

         </div>
    {:else}
        <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow border">
            <h2 class="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
            <input
                type="text"
                placeholder="Enter 6-digit OTP"
                bind:value={otp}
                class="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-blue-500"
            />
            {#if error}<p class="text-red-500 mb-4 text-center">{error}</p>{/if}
            <button
                onclick={verifyOtp}
                disabled={loading}
                class="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
                onclick={() => {
                    step = "phone";
                    otp = "";
                    error = "";
                }}
                class="w-full mt-3 bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
            >
                Back
            </button>
        </div>
    {/if}
