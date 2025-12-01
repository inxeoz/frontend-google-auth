<script lang="ts">
    interface Props {
        profile: any;
        baseUrl: string;
        token: string;
        onUpdate: (updatedProfile: any) => void;
        onCancel: () => void;
    }

    let { profile, baseUrl, token, onUpdate, onCancel }: Props = $props();

    let newPhone = $state(profile.phone || "");
    let phoneOtp = $state("");
    let phoneStep = $state<"phone" | "otp">("phone");
    let loading = $state(false);
    let error = $state("");

    async function requestPhoneChange() {
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
                `${baseUrl}/api/method/custom_booking.api.devoteee.profile.update_profile`,
                {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ phone: newPhone, otp: phoneOtp }),
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

    function cancel() {
        onCancel();
    }
</script>

<div class="max-w-md mx-auto mt-10 p-8 bg-gradient-to-br from-teal-50 to-cyan-100 rounded-xl shadow-lg border border-teal-200">
    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Change Phone Number</h2>
    {#if phoneStep === "phone"}
        <div class="space-y-4">
            <input
                type="text"
                placeholder="New Phone Number"
                bind:value={newPhone}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
            {#if error}<p class="text-red-500">{error}</p>{/if}
            <div class="flex space-x-3">
                <button
                    onclick={requestPhoneChange}
                    disabled={loading || !newPhone}
                    class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all font-medium"
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>
                <button
                    onclick={cancel}
                    class="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-all font-medium"
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
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
            {#if error}<p class="text-red-500">{error}</p>{/if}
            <div class="flex space-x-3">
                <button
                    onclick={confirmPhoneChange}
                    disabled={loading || !phoneOtp}
                    class="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all font-medium"
                >
                    {loading ? "Updating..." : "Update Phone"}
                </button>
                <button
                    onclick={cancel}
                    class="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-all font-medium"
                >
                    Cancel
                </button>
            </div>
        </div>
    {/if}
</div>