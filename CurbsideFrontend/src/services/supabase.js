import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to upload food truck images to Supabase Storage
export const uploadFoodTruckImage = async (file) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `foodtrucks/${fileName}`

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file)

  if (error) {
    console.error('Error uploading image:', error)
    throw error
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath)

  return publicUrl
}

// Helper function to delete food truck image from Supabase Storage
export const deleteFoodTruckImage = async (imageUrl) => {
  if (!imageUrl) return

  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/uploads/')
    if (urlParts.length < 2) return

    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('uploads')
      .remove([filePath])

    if (error) {
      console.error('Error deleting image:', error)
    }
  } catch (err) {
    console.error('Error in deleteFoodTruckImage:', err)
  }
}
