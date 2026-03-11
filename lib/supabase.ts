import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aecbpovgrsikbxvmnlxt.supabase.co";

const supabaseKey = "sb_publishable_TSPmtw8wwKouSGVk_2uakw_hLhD-36W";

export const supabase = createClient(supabaseUrl, supabaseKey);