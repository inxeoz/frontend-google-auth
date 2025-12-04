<script lang="ts">
    import { authToken, baseUrl } from "$lib/stores/auth";
    import { onMount } from "svelte";
    import LoginForm from "$lib/components/LoginForm.svelte";
    import ProfileView from "$lib/components/ProfileView.svelte";
    import ProfileEdit from "$lib/components/ProfileEdit.svelte";

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    let error = $state("");
    let profile: any = $state(null);
    let editMode: "profile" | "phone" | "email" | null = $state(null);

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
        editMode = null;
    }

    function startEdit() {
        editMode = "profile";
    }

    function startChangePhone() {
        editMode = "phone";
    }

    function startChangeEmail() {
        editMode = "email";
    }

    function cancelEdit() {
        editMode = null;
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
        {#if editMode}
            <ProfileEdit
                {profile}
                baseUrl={base_url}
                token={$authToken}
                mode={editMode}
                onUpdate={handleProfileUpdate}
                onCancel={cancelEdit}
            />
        {:else}
            <ProfileView
                {profile}
                {error}
                onEditProfile={startEdit}
                onChangePhone={startChangePhone}
                onChangeEmail={startChangeEmail}
            />
        {/if}
    {/if}
