import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hcldpfneuspbmictlmff.supabase.co";
const supabaseKey = "sb_publishable_BlDdgCATIlom_PQPpBjyJA_X4odCJsC";

export const supabase = createClient(supabaseUrl, supabaseKey);
