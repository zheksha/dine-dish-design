
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import seedAdmin from '../seed_admin.ts'

serve(async (req) => {
  try {
    // Check if this is a development environment setup call
    const url = new URL(req.url)
    const setupMode = url.searchParams.get('setup')
    
    if (setupMode === 'init') {
      await seedAdmin()
      return new Response(
        JSON.stringify({ message: 'Admin user seeded successfully' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Setup function called. Use ?setup=init to seed admin user.' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
