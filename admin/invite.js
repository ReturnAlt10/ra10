window.RA10_INVITE = async function(email, role, schoolId, schoolName) {
  const k = ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    '.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg4NTIxMSwiZXhwIjoyMDkzNDYxMjExfQ',
    '.pz8yuNEfjC1PouG0K0RW4pf7vyLvQQSh_5blgJMB-3s'].join('');
  try {
    const res = await fetch('https://tcrrgsylxbyyrmnouihl.supabase.co/auth/v1/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': k,
        'Authorization': 'Bearer ' + k
      },
      body: JSON.stringify({
        email,
        data: { role, school_id: schoolId, school_name: schoolName },
        redirect_to: 'https://ra10.co.uk/#/account'
      })
    });
    return res.ok;
  } catch(e) {
    return false;
  }
};