export const Verify = async (siteToken: string, secret: string) => {
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    let formData = new FormData();
    formData.append('secret', secret);
    formData.append('response', siteToken);

    const firstResult = await fetch(url, {
        body: formData,
        method: 'POST',
    });
    const firstOutcome = await firstResult.json();
    if (firstOutcome.success) {
        return true
    }
    return false
}