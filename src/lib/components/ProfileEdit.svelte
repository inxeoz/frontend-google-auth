<script lang="ts">

    interface Props {
        profile: any;
        baseUrl: string;
        token: string;
        onUpdate: (updatedProfile: any) => void;
        onCancel: () => void;
    }

    let { profile, baseUrl, token, onUpdate, onCancel }: Props = $props();

    let editData = $state({ ...profile });
    let loading = $state(false);
    let error = $state("");

    // Remove phone and companion from editData
    delete editData.phone;
    delete editData.companion;

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
</script>

<div class="max-w-md mx-auto mt-10 p-8 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl shadow-lg border border-yellow-200">
    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Edit Profile</h2>
    <form onsubmit={updateProfile} class="space-y-4">
        <input
            type="text"
            placeholder="Name"
            bind:value={editData.devoteee_name}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
        />
        <input
            type="email"
            placeholder="Email"
            bind:value={editData.email}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
        />
        <select
            bind:value={editData.gender}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
        >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>
        <input
            type="text"
            bind:value={editData.dob}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
            placeholder="Date of Birth"
        />
        <input
            type="text"
            placeholder="Aadhar"
            bind:value={editData.aadhar}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
        />
        <input
            type="text"
            placeholder="Location"
            bind:value={editData.location}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
        />
        {#if error}<p class="text-red-500">{error}</p>{/if}
        <div class="flex space-x-3">
            <button
                type="submit"
                disabled={loading}
                class="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all font-medium"
            >
                {loading ? "Updating..." : "Update"}
            </button>
            <button
                type="button"
                onclick={onCancel}
                class="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-all font-medium"
            >
                Cancel
            </button>
        </div>
    </form>
</div>