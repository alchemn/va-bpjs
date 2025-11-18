export async function logFeatureAccess(subSubFeatureId: number) {
  try {
    const token = document.cookie
      .split('; ')
      .find(c => c.startsWith('token='))
      ?.split('=')[1]

    if (!token) return

    await fetch('/api/feature-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ subSubFeatureId }),
    })
  } catch (err) {
    console.error('Failed to log feature access:', err)
  }
}
