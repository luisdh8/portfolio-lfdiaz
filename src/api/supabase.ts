import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    import.meta.env.SUPABASE_URL!,
    import.meta.env.SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
);

// Date formatting utility
export function formatDate(dateString: string): string {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const [year, month, day] = dateString.split('-').map(Number);
    const monthName = months[month - 1];
    
    return `${monthName}. ${year}`;
}

// Journey data fetching with formatting
export async function getFormattedJourneyData() {
    const { data: journeyData, error } = await supabase
        .from("experiences")
        .select("*")
        .order("start_date", { ascending: false });

    if (error) {
        console.error("Error fetching journey data:", error);
        return { data: null, error };
    }

    const formattedJourneyData = journeyData?.map(data => {
        const formattedStartDate = formatDate(data.start_date);
        const formattedEndDate = data.end_date ? formatDate(data.end_date) : "Present";
        const dateRange = `${formattedStartDate} - ${formattedEndDate}`;
        
        return {
            ...data,
            dateRange
        };
    });

    return { data: formattedJourneyData, error: null };
}

// Skills data fetching
export async function getSkillsData() {
    const { data: skillsData, error } = await supabase
        .from("skills")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching skills data:", error);
        return { data: null, error };
    }

    return { data: skillsData, error: null };
}
