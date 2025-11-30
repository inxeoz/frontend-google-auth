<script>
    import { onMount } from "svelte";

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    onMount(() => {
        // Ensure google exists (only in browser)
        if (!window.google) {
            console.error("Google API not loaded");
            return;
        }

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
            document.getElementById("google-btn"),
            {
                theme: "outline",
                size: "large",
            },
        );
    });

    function handleCredentialResponse(response) {
        console.log("Google token:", response.credential);

        fetch(
            "http://127.0.0.1:8000/api/method/custom_booking.api.devoteee.login.google_login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: response.credential }),
            },
        )
            .then((r) => r.json())
            .then((data) => {
                console.log("Login result:", data);
            });
    }
</script>

<div id="google-btn"></div>
