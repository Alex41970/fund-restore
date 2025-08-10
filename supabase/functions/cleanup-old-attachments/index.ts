import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AttachmentRecord {
  id: string
  file_path: string
  file_name: string
  created_at: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Use service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting cleanup of attachments older than 48 hours...')

    // Find attachments older than 48 hours
    const cutoffDate = new Date()
    cutoffDate.setHours(cutoffDate.getHours() - 48)

    const { data: oldAttachments, error: queryError } = await supabase
      .from('attachments')
      .select('id, file_path, file_name, created_at')
      .lt('created_at', cutoffDate.toISOString())

    if (queryError) {
      console.error('Error querying old attachments:', queryError)
      throw queryError
    }

    if (!oldAttachments || oldAttachments.length === 0) {
      console.log('No old attachments found to clean up')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No old attachments found',
          deleted_count: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log(`Found ${oldAttachments.length} attachments to clean up`)

    let deletedFiles = 0
    let deletedRecords = 0
    const errors: string[] = []

    // Process each old attachment
    for (const attachment of oldAttachments as AttachmentRecord[]) {
      try {
        console.log(`Processing attachment: ${attachment.id} - ${attachment.file_name}`)

        // Delete file from storage first
        const { error: storageError } = await supabase.storage
          .from('case-attachments')
          .remove([attachment.file_path])

        if (storageError) {
          console.error(`Storage deletion failed for ${attachment.file_path}:`, storageError)
          errors.push(`Storage: ${attachment.file_name} - ${storageError.message}`)
        } else {
          deletedFiles++
          console.log(`Deleted file: ${attachment.file_path}`)
        }

        // Delete database record
        const { error: dbError } = await supabase
          .from('attachments')
          .delete()
          .eq('id', attachment.id)

        if (dbError) {
          console.error(`Database deletion failed for ${attachment.id}:`, dbError)
          errors.push(`Database: ${attachment.file_name} - ${dbError.message}`)
        } else {
          deletedRecords++
          console.log(`Deleted database record: ${attachment.id}`)
        }

      } catch (error) {
        console.error(`Error processing attachment ${attachment.id}:`, error)
        errors.push(`Processing: ${attachment.file_name} - ${error.message}`)
      }
    }

    const result = {
      success: true,
      message: `Cleanup completed`,
      total_found: oldAttachments.length,
      deleted_files: deletedFiles,
      deleted_records: deletedRecords,
      errors: errors.length > 0 ? errors : undefined,
      cutoff_date: cutoffDate.toISOString()
    }

    console.log('Cleanup completed:', result)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Fatal error during cleanup:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        message: 'Cleanup failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})