
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// This function will create an admin user in the database for development purposes
const seedAdmin = async () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://geifywrqficiuvybmrgc.supabase.co'
  const supabaseAdminKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

  if (!supabaseAdminKey) {
    console.error('Service role key not found. Cannot seed admin user.')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAdminKey)
  
  try {
    // Create admin user if it doesn't exist
    const { data: existingUser, error: lookupError } = await supabase
      .auth
      .admin
      .listUsers({
        search: 'admin@example.com'
      })

    if (lookupError) {
      console.error('Error checking for admin user:', lookupError)
      return
    }

    // Check if user already exists
    if (existingUser && existingUser.users.length > 0) {
      console.log('Admin user already exists. Skipping creation.')
      
      // Ensure admin is in profiles table with admin role
      const userId = existingUser.users[0].id
      await ensureAdminProfileExists(supabase, userId)
      return
    }

    // Create the admin user
    console.log('Creating admin user...')
    const { data: newUser, error: createError } = await supabase
      .auth
      .admin
      .createUser({
        email: 'admin@example.com',
        password: 'admin',
        email_confirm: true,
        user_metadata: {
          name: 'Admin User'
        }
      })

    if (createError) {
      console.error('Error creating admin user:', createError)
      return
    }

    console.log('Admin user created successfully')
    
    // Create profile with admin role
    if (newUser) {
      await ensureAdminProfileExists(supabase, newUser.id)
    }
  } catch (error) {
    console.error('Error in seed_admin function:', error)
  }
}

// Helper function to ensure admin profile exists
const ensureAdminProfileExists = async (supabase: SupabaseClient, userId: string) => {
  try {
    // Check if profile exists
    const { data: existingProfile, error: profileLookupError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileLookupError && profileLookupError.code !== 'PGRST116') {
      console.error('Error checking for admin profile:', profileLookupError)
      return
    }

    // If profile exists, update it to admin role
    if (existingProfile) {
      if (existingProfile.role !== 'admin') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userId)

        if (updateError) {
          console.error('Error updating admin role:', updateError)
        } else {
          console.log('Updated existing profile to admin role')
        }
      } else {
        console.log('Profile already has admin role')
      }
      return
    }

    // Create new admin profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        role: 'admin'
      })

    if (insertError) {
      console.error('Error creating admin profile:', insertError)
    } else {
      console.log('Created admin profile successfully')
    }
  } catch (error) {
    console.error('Error ensuring admin profile exists:', error)
  }
}

export default seedAdmin
