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

<div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow border">
    <h2 class="text-2xl font-bold mb-6 text-center">Your Profile</h2>
    {#if profile}
        <div class="space-y-4">
            <p><strong>Name:</strong> {profile.devoteee_name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>DOB:</strong> {profile.dob}</p>
            <p><strong>Aadhar:</strong> {profile.aadhar}</p>
            <p><strong>Location:</strong> {profile.location}</p>
        </div>
        <div class="flex flex-col space-y-3 mt-6">
            <button
                onclick={onEditProfile}
                class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
                Edit Profile
            </button>
            <button
                onclick={onChangePhone}
                class="bg-purple-500 text-white p-3 rounded hover:bg-purple-600"
            >
                Change Phone
            </button>
            <button
                onclick={() => authToken.set(null)}
                class="bg-red-500 text-white p-3 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    {:else}
        <p class="text-center">Loading profile...</p>
    {/if}
    {#if error}<p class="text-red-500 mt-4 text-center">{error}</p>{/if}
</div>