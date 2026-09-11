import {createClient} from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function MediaUpload(file) {
    return new Promise((resolve, reject) => {
        if(file === null) {reject("no file provided");
        }else{
            const timestamp = Date.now();
            const fileName = timestamp + "_" + file.name;
            supabase.storage.from('images').upload(fileName, file,{
                cacheControl: '3600',
                upsert: false
            }).then(() => {
                const publicUrl = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
                resolve(publicUrl);
            }).catch((error) => {
                reject(error);
            });
        }
    });
}