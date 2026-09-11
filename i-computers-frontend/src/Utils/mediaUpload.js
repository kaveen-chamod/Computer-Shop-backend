import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function MediaUpload(file) {
    if (!file) {
        throw new Error("No file provided");
    }

    // පින්තූරයේ නමේ හිස්තැන් (spaces) තිබුණොත් ඒවා '_' වලින් replace කරනවා (URL අවුල් වීම වළක්වන්න)
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;

    // 'images' වෙනුවට 'mern-bucket' භාවිතා කර ඇත
    const { data, error } = await supabase.storage
        .from('mern-bucket') 
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    // Supabase එකෙන් error එකක් ආවොත් එය මෙතනින් අල්ලා ගනී
    if (error) {
        console.error("Supabase Upload Error:", error.message);
        throw error;
    }

    // සාර්ථකව upload වුණා නම් Public URL එක ලබාගැනීම
    const publicUrl = supabase.storage
        .from('mern-bucket') // මෙතනත් 'mern-bucket' ලෙස වෙනස් කළා
        .getPublicUrl(fileName).data.publicUrl;

    return publicUrl;
}