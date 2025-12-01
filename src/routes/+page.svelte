<script lang="ts">
    import { authToken, baseUrl } from "$lib/stores/auth";
    import { onMount } from "svelte";
    import LoginForm from "$lib/components/LoginForm.svelte";
    import ProfileView from "$lib/components/ProfileView.svelte";
    import ProfileEdit from "$lib/components/ProfileEdit.svelte";
    import PhoneChange from "$lib/components/PhoneChange.svelte";

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    let error = $state("");
    let profile: any = $state(null);
    let editing = $state(false);
    let changingPhone = $state(false);

    let base_url = $state("http://localhost:8000");
    baseUrl.subscribe((value: string) => (base_url = value));

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

    function handleLoginSuccess() {
        loadProfile();
    }

    function handleProfileUpdate(updatedProfile: any) {
        profile = updatedProfile;
        editing = false;
        changingPhone = false;
    }

    function startEdit() {
        editing = true;
    }

    function cancelEdit() {
        editing = false;
    }

    function startChangePhone() {
        changingPhone = true;
    }

    function cancelChangePhone() {
        changingPhone = false;
    }

    onMount(() => {
        if ($authToken) {
            loadProfile();
        }
    });
</script>

{#if !$authToken}
    <LoginForm {clientId} baseUrl={base_url} onLoginSuccess={handleLoginSuccess} />
{:else}
    {#if changingPhone}
        <PhoneChange
            {profile}
            baseUrl={base_url}
            token={$authToken}
            onUpdate={handleProfileUpdate}
            onCancel={cancelChangePhone}
        />
    {:else if editing}
        <ProfileEdit
            {profile}
            baseUrl={base_url}
            token={$authToken}
            onUpdate={handleProfileUpdate}
            onCancel={cancelEdit}
        />
    {:else}
        <ProfileView
            {profile}
            {error}
            onEditProfile={startEdit}
            onChangePhone={startChangePhone}
        />
    {/if}
{/if}
