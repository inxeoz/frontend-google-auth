<script lang="ts">
    import { authToken } from "$lib/stores/auth";

    interface Props {
        profile: any;
        error: string;
        onEditProfile: () => void;
        onChangePhone: () => void;
    }

    let { profile, error, onEditProfile, onChangePhone }: Props = $props();
</script>

<div class="max-w-md mx-auto mt-10 p-8 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl shadow-lg border border-purple-200">
    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Your Profile</h2>
    {#if profile}
        <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <p class="text-gray-700"><strong class="text-purple-600">Name:</strong> {profile.devoteee_name}</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <p class="text-gray-700"><strong class="text-purple-600">Email:</strong> {profile.email}</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <p class="text-gray-700"><strong class="text-purple-600">Phone:</strong> {profile.phone}</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <p class="text-gray-700"><strong class="text-purple-600">Gender:</strong> {profile.gender}</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <p class="text-gray-700"><strong class="text-purple-600">DOB:</strong> {profile.dob}</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <p class="text-gray-700"><strong class="text-purple-600">Aadhar:</strong> {profile.aadhar}</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <p class="text-gray-700"><strong class="text-purple-600">Location:</strong> {profile.location}</p>
            </div>
        </div>
        <div class="flex flex-col space-y-3 mt-6">
            <button
                onclick={onEditProfile}
                class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
            >
                Edit Profile
            </button>
            <button
                onclick={onChangePhone}
                class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-medium"
            >
                Change Phone
            </button>
            <button
                onclick={() => authToken.set(null)}
                class="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium"
            >
                Logout
            </button>
        </div>
    {:else}
        <p class="text-center text-gray-600">Loading profile...</p>
    {/if}
    {#if error}<p class="text-red-500 mt-4 text-center">{error}</p>{/if}
</div>