/* BTEC Sport Unit 2 — case studies.
   PEARSON: the 12 published set tasks (Part A case study + Part B lifestyle questionnaire), transcribed from the papers.
   RA10:    original practice clients written in the same format to cover client types Pearson has not used yet.
   Each case produces the six set-task activities (60 marks) with a trait-based mark scheme built from the
   Pearson examiner reports (2017–2024). */
(function () {
  'use strict';
  const U2 = window.U2;

  // d(breakfast, lunch, dinner, snacks, fluid, times[b,l,d])
  function d(b, l, dn, s, fluid, t) { return { breakfast: b, lunch: l, dinner: dn, snacks: s, fluid, times: t || [] }; }

  const CASES = [
    /* ───────────────────────── PEARSON PAST PAPERS ───────────────────────── */
    {
      id: 'PP-1706', source: 'pearson', series: 'June 2017', name: 'Helen Jones', first: 'Helen', age: 48, sex: 'F',
      partA: 'Helen is a 48-year-old female. She works as a receptionist, spending eight hours a day sitting behind a desk. She drives two miles to work every day and does not do any exercise.\n\nHelen notices that her health is starting to deteriorate. She often feels tired and regularly suffers from chest pains. She has decided to see her general practitioner who does a health assessment on her. Helen’s blood pressure, resting heart rate, Body Mass Index (BMI) and waist to hip ratio were all measured as part of her health assessment. The doctor has suggested that her lifestyle is not appropriate and that she is at risk of developing coronary heart disease (CHD).\n\nHelen decides to change her lifestyle for the better as she does not want her condition to deteriorate any more. Her main aim is to increase her overall health and well-being.',
      occupation: 'A receptionist', hours: '8 hours per day with a 45-minute lunch break', distance: '2 miles', travel: 'Car', activeJob: 'Not very active',
      activityFreq: 'None', activityType: 'None',
      diary: [
        d('Bowl of cereal', 'Sandwiches, packet of crisps', 'Chinese takeaway', 'Chocolate bar, packet of crisps, donut', '3 × cups of tea, 1 fizzy drink, 2 glasses of wine, cup of coffee', ['7am', '12.30pm', '7pm']),
        d('2 × pieces of toast with jam', 'Portion of chips with mayo, cheeseburger', 'Pizza', 'Packet of crisps, chocolate bar', '3 × cups of tea, 1 fizzy drink, 2 glasses of wine, cup of coffee', ['7am', '12.30pm', '7pm'])
      ],
      supplements: 'No', alcohol: 18, smoking: 5, stress: 'Increase in workload and number of different tasks to complete', sleep: '8', sleepHours: 8,
      tests: { bp: [160, 95], rhr: 85, bmi: 36, whr: 0.93, extra: [['Weight', '104 kg / 16 st 5'], ['Height', '1.7 m / 5 ft 7']] },
      goal: 'To improve my overall health and wellbeing. To do regular exercise and gradually improve my fitness.',
      focus: 'health', cautions: ['Chest pains and grade 2 hypertension — must get GP clearance (PAR-Q “yes”) before starting; keep to low–moderate intensity', 'Obese (BMI 36): low-impact activities to protect knees and ankles'],
      analysis: {
        diet: 'very high in saturated fat, salt and sugar (takeaway, chips, cheeseburger, pizza, crisps, chocolate, donut, fizzy drinks); almost no fruit, vegetables or wholegrains and no water',
        exercise: 'no physical activity at all — far below the 150 minutes a week adult guideline',
        sedentary: 'sits at a desk for 8 hours and drives only 2 miles to work, so almost all of her day is sedentary'
      },
      components: [['Aerobic endurance', 'to strengthen the heart, lower blood pressure and RHR and reduce her CHD risk'], ['Body composition', 'to burn fat and reduce her BMI and waist-to-hip ratio'], ['Muscular endurance', 'to cope with everyday tasks and raise metabolic rate'], ['Flexibility', 'to improve posture and reduce stiffness from sitting all day']],
      nutrition: ['Reduce intake to below 2,000 kcal (about a 500 kcal/day deficit) to lose about 0.5 kg a week', 'Swap takeaways and chips for home-cooked meals with lean protein (chicken, fish, beans) and vegetables', 'Cut saturated fat below 20 g/day and salt below 6 g/day to help lower blood pressure', 'Replace white toast and cereal with wholegrain options (porridge) for slow-release energy and fibre (30 g/day)', 'Eat at least 5 portions of fruit and vegetables a day for vitamins (C, A) and potassium', 'Replace fizzy drinks and wine with water: 6–8 glasses (1.5–2 L) a day'],
      modPriority: 'Smoking and physical activity are the priorities because both directly increase her CHD risk and chest-pain symptoms; alcohol and stress reduction support blood pressure control.',
      barriers: ['Tiredness after work', 'Lack of confidence about exercising when overweight', 'Nicotine withdrawal symptoms and cravings', 'Work stress used as a trigger to smoke/drink'],
      smarter: 'Walk briskly for 30 minutes on 5 days a week and lose 3 kg within six weeks, recorded in a training diary and reviewed with her GP.',
      timeline: 'Six-week mesocycle at the start of a longer (6–12 month) macrocycle aimed at reducing her CHD risk.'
    },
    {
      id: 'PP-1801', source: 'pearson', series: 'January 2018', name: 'Adam King', first: 'Adam', age: 23, sex: 'M',
      partA: 'Adam is a 23-year-old full-time athlete. He competes as a long-distance runner. He trains every day and drives for 20 minutes to get to his training venue.\n\nAdam uses a combination of different training methods. He often competes in high level competitions around the world. His main target is to qualify for the next Olympic Games for Team GB.\n\nAdam is going to train away from home for one month in a remote environment. His emphasis will be on improving his general performance for his next competition. Adam will have a full health screening assessment before he goes away to train.\n\nAdam tries to look after his health and fitness because he wants to be one of the best long-distance runners in the country. He also hopes to compete in many future Olympic Games.',
      occupation: 'Full-time athlete', hours: '5–6 hours a day', distance: '20-minute drive', travel: 'By car', activeJob: 'Very active (full-time athlete)',
      activityFreq: 'Every day of the week', activityType: 'Long-distance running and strength and conditioning sessions',
      diary: [
        d('Bowl of porridge', 'Jacket potato with cheese and beans', 'Roast chicken with potatoes, carrots and broccoli', 'Apple, packet of crisps', '3 litres of water, 1 cup of tea, 1 cup of coffee, 1 large glass of white wine', ['7am', '12.30pm', '6pm']),
        d('Scrambled eggs on toast', 'Chicken and pasta in a tomato-based sauce', 'Steak and chips', 'An orange, chocolate bar', '3 litres of water, 1 cup of tea, 1 cup of coffee, 1 large glass of red wine', ['7am', '12.30pm', '6pm'])
      ],
      supplements: 'No', alcohol: 21, smoking: 0, stress: 'Pressure of training and expectations of winning competitions', sleep: '5–6', sleepHours: 5.5,
      tests: { bp: [119, 81], rhr: 45, bmi: 18, whr: 0.75 },
      goal: 'To compete for Team GB at the next Olympic Games. To be a world-class long-distance marathon runner.',
      focus: 'sport', sport: 'long-distance running', endurance: true,
      cautions: ['Underweight (BMI 18): energy intake must match very high training volume', 'Training every day with only 5–6 hours’ sleep — risk of overtraining; build in recovery'],
      analysis: {
        diet: 'generally balanced with good carbohydrate sources (porridge, potato, pasta) and lean protein, but too little energy and carbohydrate for daily endurance training, few vegetables at some meals, and crisps/chocolate as snacks',
        exercise: 'trains every day — well above guidelines and appropriate for an elite athlete, but no rest day increases overtraining and injury risk',
        sedentary: 'not sedentary — an active full-time athlete, although he drives to training'
      },
      components: [['Aerobic endurance', 'the main energy system for marathon/long-distance events'], ['Muscular endurance', 'leg muscles must contract repeatedly for 2+ hours without fatigue'], ['Speed', 'for race tactics, surges and the sprint finish'], ['Flexibility', 'to maintain stride length and reduce injury risk from high mileage'], ['Core stability', 'to maintain running posture and efficiency when fatigued']],
      nutrition: ['Increase energy intake well above 2,500 kcal (likely 3,000–3,500+ kcal) to match daily endurance training and move BMI into the healthy range', 'Carbohydrate around 7–10 g/kg/day (55–65% of energy) from pasta, rice, potatoes, oats to keep glycogen stores full', 'Protein 1.2–1.4 g/kg/day from chicken, fish, eggs, dairy, pulses to repair muscle after sessions', 'Iron-rich foods (red meat, spinach, fortified cereal) and vitamin C to support haemoglobin for oxygen transport', 'Hydration: keep 3 L+ a day and add electrolytes in long sessions; isotonic sports drinks during runs over 60–90 minutes', 'Ergogenic aids (spec): carbohydrate loading in the 36–48 hours before races over 90 minutes (10–12 g/kg/day; maximises glycogen, but can cause bloating/heaviness); energy gels and bars during long sessions (30–60 g carbohydrate per hour; quick energy, may upset the stomach); protein drinks after sessions for repair; isotonic drinks during, hypertonic after, hypotonic for rapid rehydration'],
      modPriority: 'Alcohol (21 units, above 14) and stress/sleep are the priorities because they directly impair recovery and adaptation; physical activity is already high.',
      barriers: ['Social drinking habits', 'Pressure and expectation from competition', 'Being away from home and support networks for a month'],
      smarter: 'Improve 10 km time by 30 seconds within six weeks, measured by a time trial at the end of the training camp and recorded in a training diary.',
      timeline: 'Six-week mesocycle in the preparation phase of an Olympic macrocycle, building towards his next competition.'
    },
    {
      id: 'PP-1901', source: 'pearson', series: 'January 2019', name: 'Nyle Hudson', first: 'Nyle', age: 19, sex: 'M',
      partA: 'Nyle is a 19-year-old student who enjoys training and competing in the 100 m sprint. Nyle has competed for his local athletics club for several seasons and he hopes to compete at the highest level he possibly can.\n\nNyle has had a long time away from the sport. He is now determined to start training again as the athletics season will be starting soon.\n\nHis athletics coach has suggested that he should take part in a full screening assessment for his health and wellbeing before his training programme begins. Nyle’s coach has also suggested that he will need to change parts of his lifestyle if he is to achieve his sporting goals this season.\n\nNyle’s goals are to get back to training on a regular basis and try to achieve a new personal best in the 100 m sprint this season.',
      occupation: 'A full-time student', hours: '4–5 hours of study per day', distance: '1 mile', travel: 'Walk', activeJob: 'Not very active',
      activityFreq: 'Twice a week – each session being 30 minutes', activityType: 'Sprint training',
      diary: [
        d('Nothing', 'Jacket potato with cheese and beans', 'Cheese and tomato pizza', '1 × apple, 1 × chocolate bar', '2 × cups of coffee, 2 × pints of lager', ['8am', '12pm', '9pm']),
        d('Toast with butter and jam × 2', 'Beef burger and chips', 'Chinese takeaway', '1 piece of fruit, packet of crisps, sweets', '2 × cups of coffee, 3 × pints of lager', ['8am', '12pm', '8.30pm'])
      ],
      supplements: 'No', alcohol: 18, smoking: 2, stress: null, sleep: '7–8', sleepHours: 7.5,
      tests: { bp: [130, 85], rhr: 71, bmi: 28, whr: 0.96 },
      goal: 'To train on a regular basis and to achieve a new personal best in the 100 m sprint this season.',
      focus: 'sport', sport: '100 m sprint',
      cautions: ['Returning after a long break — build up gradually to avoid hamstring injury'],
      analysis: {
        diet: 'skips breakfast; high in fat and salt (pizza, burger and chips, Chinese takeaway, crisps, sweets) with little lean protein for muscle repair and few vegetables; no water recorded',
        exercise: 'only two 30-minute sessions a week — below the 150 minutes a week guideline and far too little for a competitive sprinter',
        sedentary: 'studies for 4–5 hours a day (not very active) but walks 1 mile to college, which is positive'
      },
      components: [['Speed', 'the most important component — the 100 m is decided by acceleration and maximum speed'], ['Power', 'explosive leg power out of the blocks and in each stride'], ['Muscular strength', 'stronger leg muscles produce more force and support power'], ['Reaction time', 'reacting quickly to the starting gun'], ['Flexibility', 'hip and hamstring range for stride length and injury prevention']],
      nutrition: ['Eat breakfast every day (e.g. porridge, eggs on wholegrain toast) to fuel training and study', 'Energy around 2,500–3,000 kcal on training days, with carbohydrates (about 5–7 g/kg/day) to fuel high-intensity sessions', 'Increase protein to 1.6–1.7 g/kg/day (chicken, fish, eggs, milk, beans) to build and repair muscle for power', 'Reduce takeaways, fried food, crisps and sweets to lower body fat and BMI', 'Drink 2–2.5 L of water a day; replace lager with water', 'Ergogenic aids (spec): protein drinks (about 20–25 g within 30–60 minutes after training to support muscle repair and power gains; costly and unnecessary if diet is adequate); energy gels or bars between heats/sessions for quick carbohydrate (may cause stomach upset); carbohydrate loading is NOT needed for short sprint events; isotonic drinks during training, hypotonic for rapid rehydration'],
      modPriority: 'Smoking and alcohol are the priorities because they reduce oxygen transport and recovery; physical activity must increase to meet his sporting goal.',
      barriers: ['Student social life involving alcohol', 'Nicotine addiction (even at 2 a day)', 'Limited time around study and cost of training/gym'],
      smarter: 'Reduce 100 m time from 11.6 s to 11.4 s within six weeks, measured by an electronic-timed trial and recorded in his training diary.',
      timeline: 'Six-week mesocycle in the pre-season (preparation) phase of the athletics macrocycle.'
    },
    {
      id: 'PP-1906', source: 'pearson', series: 'June 2019', name: 'Alan Turner', first: 'Alan', age: 70, sex: 'M',
      partA: 'Alan is 70 years old and has recently retired from a busy career of being a managing director, which took up a lot of his free time. Alan now has more spare time and would like to use this to return to his childhood passion of playing tennis.\n\nHowever, Alan has not taken part in regular exercise for many years. He is worried about whether he will be able to cope with the demands of the sport and the impact that it will have on his body.\n\nAlan has been advised to have a full health screening assessment before he undertakes any form of exercise. Alan is aware that regular exercise will also help him in other aspects of his lifestyle and wellbeing that need to change.\n\nAlan would like to improve his general fitness levels and participate in physical activity regularly for fun and enjoyment.',
      occupation: 'Recently retired', hours: '—', distance: 'N/A', travel: 'N/A', activeJob: 'Not very active',
      activityFreq: 'None', activityType: 'N/A',
      diary: [
        d('Egg, bacon and mushrooms', 'Ham sandwich and crisps', 'Steak, potatoes and vegetables', 'Peanuts, 1 × chocolate bar', '3 × cups of tea, 2 × glasses of red wine', ['8.30am', '12.30pm', '7pm']),
        d('Sausages, mushrooms, tomatoes and baked beans', 'Chicken Caesar salad', 'Fish and chips takeaway', 'Packet of crisps, doughnut', '3 × cups of tea, 3 × glasses of red wine, 1 × glass of water', ['8.30am', '12.45pm', '7.30pm'])
      ],
      supplements: 'No', alcohol: 25, smoking: 5, stress: null, sleep: '8', sleepHours: 8,
      tests: { bp: [150, 92], rhr: 72, bmi: 29, whr: 0.98 },
      goal: 'To improve general fitness levels and participate in physical activity regularly for enjoyment.',
      focus: 'health', sport: 'tennis (recreational)', older: true,
      cautions: ['Aged 70 with grade 1 hypertension — GP clearance and low-to-moderate intensity', 'Include balance work (older-adult guideline) to reduce falls risk', 'Low-impact options to protect ageing joints'],
      analysis: {
        diet: 'high in saturated fat and salt (fried breakfast, sausages, bacon, fish and chips, crisps, peanuts) and sugar (chocolate, doughnut); some positives (vegetables, salad, steak with potatoes) but very little water',
        exercise: 'no regular exercise for many years — below the 150 minutes a week guideline and missing the balance and strength activities recommended for over-65s',
        sedentary: 'recently retired with lots of free time — a risk of becoming even more sedentary'
      },
      components: [['Aerobic endurance', 'to cope with rallies and to lower blood pressure'], ['Flexibility', 'range of movement for serving and reaching, and reducing joint stiffness'], ['Muscular endurance', 'repeated strokes and movement around the court'], ['Balance', 'reduces falls risk (older-adult guideline) and helps when changing direction'], ['Agility', 'changing direction to reach the ball']],
      nutrition: ['Around 2,300–2,500 kcal (male guideline 2,500) with a small deficit to move BMI from 29 towards the healthy range', 'Replace fried breakfasts with porridge, wholegrain toast, eggs and fruit; reduce sausages, bacon, crisps and takeaways (saturated fat < 30 g/day, salt < 6 g/day) to lower blood pressure', 'Protein about 1.0–1.2 g/kg/day (fish, chicken, eggs, pulses) to slow age-related muscle loss', 'Calcium and vitamin D (dairy, oily fish, fortified foods) for bone health at 70', 'At least 5 portions of fruit and vegetables a day and 30 g fibre', 'Drink 6–8 glasses of water a day and before/during tennis; reduce red wine'],
      modPriority: 'Smoking and alcohol are the priorities because, with grade 1 hypertension at 70, they most increase his risk of CHD and stroke; increasing physical activity will help both.',
      barriers: ['Long-term habits (smoking and drinking for many years)', 'Worry about coping physically with tennis', 'Lack of confidence after years of inactivity'],
      smarter: 'Play two 45-minute social doubles tennis sessions a week and walk 30 minutes on three other days within six weeks, recorded in an activity diary.',
      timeline: 'Six-week mesocycle at the start of a long-term (12-month) macrocycle to build health and return to regular tennis.'
    },
    {
      id: 'PP-2001', source: 'pearson', series: 'January 2020', name: 'Lisa Goddard', first: 'Lisa', age: 38, sex: 'F',
      partA: 'Lisa is a 38 year-old female who works in an office. She sits at a desk from 9 am until 5 pm for five days a week. She drives 10 miles to work each day and takes her children to school on the way.\n\nLisa has spent many years working full time and also looking after her children. This has had a negative impact on her health and wellbeing. Lisa’s family have noticed that she often looks very tired and she knows she has gained extra body weight.\n\nLisa has made an appointment to see an expert to get some lifestyle advice. Lisa has been told to have a full health screening assessment before she receives any guidance.\n\nLisa would like to improve her health and wellbeing by increasing her energy levels and by losing some of the extra weight she has gained.',
      occupation: 'Office worker', hours: '7.5 hrs', distance: '10 miles', travel: 'Car', activeJob: 'Not active',
      activityFreq: 'None', activityType: 'N/A',
      diary: [
        d('1 piece of white toast with jam', 'Ham and cheese sandwich with crisps, chocolate bar', 'Chicken, chips and vegetables', 'Ice cream, chocolate bar, packet of crisps, sausage roll', '2 × cups of tea, 500 ml of water, 2 × glasses of white wine', ['8am', '12.30pm', '6.30pm']),
        d('Bowl of cereal (coco pops)', 'Lasagne and chips, ice cream', 'Fish, potatoes and vegetables', '2 × packets of crisps, doughnut, chocolate bar, yoghurt', '2 × cups of tea, 500 ml of water, 3 × glasses of white wine', ['8am', '12.30pm', '6.30pm'])
      ],
      supplements: 'No', alcohol: 35, smoking: 0, stress: 'Work and looking after the children', sleep: '5', sleepHours: 5,
      tests: { bp: [135, 90], rhr: 75, bmi: 28, whr: 0.85 },
      goal: 'To lose some of my extra weight and increase my health and wellbeing.',
      focus: 'health',
      cautions: ['Very limited time because of work and children — sessions must be short and fit around family', 'Only 5 hours’ sleep — avoid very early high-intensity sessions'],
      analysis: {
        diet: 'high in sugar and saturated fat (white toast with jam, coco pops, crisps, chocolate, ice cream, doughnut, sausage roll, chips); main meals include vegetables, but snacking is excessive and water intake is low (500 ml)',
        exercise: 'no physical activity — below the 150 minutes a week adult guideline',
        sedentary: 'sits at a desk 9–5 and drives 10 miles each way, so most of her day is sedentary'
      },
      components: [['Aerobic endurance', 'to raise energy levels, burn calories and lower blood pressure'], ['Body composition', 'to lose excess body fat and reduce BMI'], ['Muscular endurance', 'to raise metabolic rate and cope with daily tasks'], ['Core stability', 'to support posture after long periods of sitting'], ['Flexibility', 'to reduce stiffness from sitting at a desk']],
      nutrition: ['Reduce intake below 2,000 kcal (around a 500 kcal/day deficit) for gradual weight loss of about 0.5 kg a week', 'Replace sugary cereal and white toast with porridge or wholegrain toast for slow-release energy to fight tiredness', 'Swap crisps, chocolate and doughnuts for fruit, yoghurt and nuts; cut free sugars below 30 g/day', 'Lean protein (chicken, fish, eggs, beans) at each meal to keep her full', 'At least 5 portions of fruit and vegetables a day for iron, vitamin C and B vitamins (energy release)', 'Increase water from 500 ml to 1.5–2 L a day; cut wine (empty calories at 7 kcal/g)'],
      modPriority: 'Alcohol (35 units — 2.5 times the guideline) and stress/sleep are the priorities because they drive her tiredness, weight gain and raised blood pressure; increasing activity supports all three.',
      barriers: ['Lack of time because of work and childcare', 'Tiredness from poor sleep', 'Alcohol used to relax after a stressful day'],
      smarter: 'Lose 3 kg in six weeks by completing three 30-minute exercise sessions a week, measured with weekly weigh-ins and recorded in a diary.',
      timeline: 'Six-week mesocycle at the start of a 6–12 month macrocycle aimed at weight loss and better energy.'
    },
    {
      id: 'PP-2101', source: 'pearson', series: 'January 2021', name: 'Trevor Bishop', first: 'Trevor', age: 48, sex: 'M',
      partA: 'Trevor is 48 years old and works as a lorry driver. He works very long hours and drives all over the UK and Europe. Due to the long hours and constant driving, Trevor often feels tired and does not feel like exercising at all. His driving schedule has had a negative effect on his diet, which is not healthy.\n\nAfter 20 years of being a lorry driver, Trevor has problems with his health and wellbeing. Many of these problems have occurred because Trevor is very overweight.\n\nTrevor sees a doctor about his poor health condition and how overweight he is. The doctor wants Trevor to undertake a full health screening assessment before any advice is given.\n\nTrevor wishes to continue working as a lorry driver but wants to lose a large amount of weight and improve his general lifestyle and wellbeing.',
      occupation: 'Lorry driver', hours: 'Approx. 10 hours', distance: '1 mile', travel: 'Car', activeJob: 'Not very active',
      activityFreq: 'None', activityType: 'N/A',
      diary: [
        d('Egg, bacon, sausage, mushrooms, baked beans and 2 × slices of toast', 'Cheeseburger and chips', 'Chicken, chips and salad', '1 × chocolate bar, 1 × packet of crisps', '2 × cup of tea, 4 × can of fizzy drink', ['8am', '12.30pm', '7pm']),
        d('Egg, bacon, sausage, mushrooms, baked beans and 2 × slices of toast', 'Bacon sandwich', 'Fish and chips takeaway', '1 × chocolate bar, 1 × packet of crisps', '3 × cup of tea, 5 × can of fizzy drink', ['8.15am', '12.45pm', '7.30pm'])
      ],
      supplements: 'No', alcohol: 3, smoking: 10, stress: 'Driving conditions and meeting deadlines of arrival', sleep: '5', sleepHours: 5,
      tests: { bp: [165, 95], rhr: 86, bmi: 39, whr: 1.16 },
      goal: 'To lose a lot of weight and improve my general lifestyle and wellbeing.',
      focus: 'health',
      cautions: ['Grade 2 hypertension and BMI 39 — GP clearance needed; low-impact, low-to-moderate intensity', 'Away from home for long periods — needs exercises he can do with little or no equipment (bodyweight, walking at stops)'],
      analysis: {
        diet: 'extremely high in saturated fat and salt (full fried breakfast twice, bacon sandwich, cheeseburger, chips, fish and chips) and sugar (4–5 cans of fizzy drink a day, chocolate); almost no fruit, vegetables or water',
        exercise: 'no physical activity — well below the 150 minutes a week guideline',
        sedentary: 'sits driving for about 10 hours a day and drives the 1 mile to work — a highly sedentary lifestyle'
      },
      components: [['Aerobic endurance', 'to lower BP and RHR and burn calories for weight loss'], ['Body composition', 'to reduce his very high BMI and central fat (WHR 1.16)'], ['Muscular endurance', 'to raise metabolism and support his back and posture after long hours sitting'], ['Flexibility', 'to reduce stiffness from long hours in the cab'], ['Core stability', 'to protect his lower back while driving']],
      nutrition: ['Reduce intake below 2,500 kcal — a 500–600 kcal/day deficit — for safe loss of about 0.5 kg a week', 'Replace the fried breakfast with porridge, eggs on wholegrain toast or fruit and yoghurt', 'Plan and pack meals/snacks for the cab (wholemeal sandwiches with lean meat, salad, fruit, nuts) instead of service-station fast food', 'Cut saturated fat below 30 g/day and salt below 6 g/day to reduce his blood pressure', '5+ portions of fruit and vegetables and 30 g fibre a day', 'Replace 4–5 cans of fizzy drink (about 35 g sugar each) with water or sugar-free drinks; aim for 2–2.5 L of water a day'],
      modPriority: 'Smoking and physical activity are the priorities because grade 2 hypertension and a WHR of 1.16 put him at very high risk of CHD and stroke; stress and sleep management support these changes.',
      barriers: ['Long, irregular working hours away from home', 'Limited access to healthy food and facilities on the road', 'Tiredness and low motivation', 'Nicotine addiction and smoking to cope with stress while driving'],
      smarter: 'Walk 20 minutes during each rest stop on 5 days a week and lose 4 kg within six weeks, recorded on a step-counter app and weekly weigh-ins.',
      timeline: 'Six-week mesocycle at the start of a 12-month macrocycle aimed at large, safe weight loss.'
    },
    {
      id: 'PP-2201', source: 'pearson', series: 'January 2022', name: 'Nadia Kang', first: 'Nadia', age: 18, sex: 'F',
      partA: 'Nadia is an 18-year-old swimmer who has a chance of competing for Team GB at the next Olympic Games. She has no rest days during the week. She trains twice a day from Monday to Friday, once in the morning before college and again in the evening. Every weekend she takes part in competitions, entering several short-distance sprint races.\n\nRecently, Nadia has been feeling very tired both mentally and physically. This has had a negative impact on the intensity that she trains at. In her most recent national competition, Nadia did not perform well in any of her races.\n\nNadia has decided to change her coach to increase the standard of her training and performances. Nadia’s coach wants her to undergo a full health screening and lifestyle assessment before she starts her new training programme.\n\nNadia is determined to be selected for Team GB and compete for a medal at the next Olympic Games in her specialist 50 metre sprint event.',
      occupation: 'Student', hours: '5 hrs', distance: '10 miles', travel: 'Car', activeJob: 'Not very active',
      activityFreq: 'Training: 10 times a week – twice daily (2 × 1.5 hr sessions) – all pool-based training. Competition: 1 on Saturday, 1 on Sunday', activityType: 'Swimming',
      diary: [
        d('1 × banana', 'Chicken salad, 1 × apple', 'Salmon, rice and vegetables', '1 × packet of crisps, 1 × chocolate bar', '3 litres of water', ['6.15am', '12.45pm', '8pm']),
        d('1 × toast with honey', 'Ham and cheese sandwich, 1 × banana', 'Steak, chips and salad', '2 × packet of crisps, 1 × apple', '1 × fizzy drink, 2 litres of water', ['6.15am', '12.45pm', '8pm'])
      ],
      supplements: 'No', alcohol: 0, smoking: 4, stress: 'Wanting to win swimming competitions', sleep: '6–7', sleepHours: 6.5,
      tests: { bp: [120, 80], rhr: 58, bmi: 17, whr: 0.72 },
      goal: 'To be selected for Team GB and compete for a medal at future Olympic Games.',
      focus: 'sport', sport: '50 m sprint swimming',
      cautions: ['Signs of overtraining (no rest days, mental and physical fatigue, falling performance) — programme must include rest days', 'Underweight (BMI 17) — risk of low energy availability'],
      analysis: {
        diet: 'too little energy for 15+ hours of training a week — a banana or one piece of toast before a 1.5-hour morning session is not enough carbohydrate; good lean protein and vegetables at dinner, but crisps and chocolate as snacks',
        exercise: '10 sessions plus two competitions a week with no rest days — far above guidelines and likely causing overtraining',
        sedentary: 'not sedentary overall, although college study is not very active'
      },
      components: [['Speed', 'the 50 m sprint is decided by maximum speed'], ['Power', 'explosive starts and turns off the blocks and wall'], ['Muscular strength', 'more force per stroke and kick'], ['Reaction time', 'reacting to the start signal'], ['Flexibility', 'shoulder and ankle range for an efficient stroke'], ['Core stability', 'streamlined body position and transfer of force']],
      nutrition: ['Increase energy above 2,000 kcal (likely 2,800–3,200 kcal on double-session days) and move BMI into the healthy range', 'Carbohydrate around 6–8 g/kg/day: a proper breakfast before morning training (porridge, toast, banana) and carbohydrate at every meal to restore glycogen', 'Protein 1.6–1.7 g/kg/day spread through the day (eggs, chicken, fish, milk, Greek yoghurt) for repair and strength', 'Calcium, vitamin D and iron (dairy, oily fish, red meat, leafy greens) — important for female athletes in heavy training', 'Hydration: keep 2–3 L a day (pool sweating is easy to miss); isotonic drinks during sessions', 'Ergogenic aids (spec): protein drinks (about 20–25 g within 30–60 minutes after training to support muscle repair and power gains; costly and unnecessary if diet is adequate); energy gels or bars between heats/sessions for quick carbohydrate (may cause stomach upset); carbohydrate loading is NOT needed for short sprint events; isotonic drinks during training, hypotonic for rapid rehydration'],
      modPriority: 'Smoking and stress are the priorities because smoking reduces oxygen transport and stress/poor sleep are adding to her fatigue; rest and recovery must be built back into her training.',
      barriers: ['Pressure to win and fear of losing her place', 'Nicotine addiction', 'Busy schedule (college plus training twice a day)'],
      smarter: 'Reduce 50 m freestyle time by 0.3 seconds within six weeks, measured at a timed trial and recorded in her training log.',
      timeline: 'Six-week mesocycle in the preparation phase of an Olympic macrocycle, including a taper before the next major competition.'
    },
    {
      id: 'PP-2206', source: 'pearson', series: 'June 2022', name: 'Zara Gibson', first: 'Zara', age: 24, sex: 'F',
      partA: 'Zara is 24 years old. She used to be a goalkeeper for a football team but she stopped playing football 5 years ago. Because Zara has recently been watching her role models on television she now wants to start playing football again.\n\nZara has decided to join a new football team that is approximately 2 miles from her home. The team trains twice per week and competes in matches on Saturdays.\n\nThe coach has watched Zara play and he thinks Zara could be an important player for the team this season. All new players must have a full health screening assessment.\n\nZara is very excited about playing for a football team again, but she is worried about her poor fitness levels and reaction time. Her aim is to increase both her physical fitness and her skill-related fitness, so that she will play well for her new team this season.',
      occupation: 'Waitress', hours: '6.5 hours', distance: '5 miles', travel: 'Bus', activeJob: 'Quite active',
      activityFreq: 'None', activityType: 'N/A',
      diary: [
        d('2 × pieces of toast with jam', 'Chicken salad, 1 × apple', 'Cheeseburger and chips', '2 × packet of crisps, 1 × chocolate bar, 1 × packet of sweets', '2 × cups of coffee, 3 × glass of white wine', ['8.45am', '1.30pm', '9.30pm']),
        d('1 × bowl of cereal with milk', 'Soup with 2 slices of bread, 1 × apple', 'Pizza', '2 × chocolate bars, peanuts, 1 × slice of chocolate cake', '3 × cups of coffee, 3 × glass of white wine', ['9am', '1.30pm', '9.30pm'])
      ],
      supplements: 'No', alcohol: 25, smoking: 6, stress: null, sleep: '7.5', sleepHours: 7.5,
      tests: { bp: [130, 85], rhr: 76, bmi: 26, whr: 0.83 },
      goal: 'To increase my physical fitness and my skill-related fitness.',
      focus: 'sport', sport: 'football (goalkeeper)',
      cautions: ['Returning after five years out — progress gradually; team training twice a week plus Saturday matches must count in the programme'],
      analysis: {
        diet: 'high in sugar and saturated fat (crisps, chocolate, sweets, cake, cheeseburger, pizza), late evening meals (9.30 pm); some positives (chicken salad, soup, apples) but almost no water',
        exercise: 'no physical activity — below the 150 minutes a week guideline (her job is quite active, which helps)',
        sedentary: 'not fully sedentary — waitressing is quite active — but she travels by bus and does no planned exercise'
      },
      components: [['Reaction time', 'a goalkeeper must react to shots and deflections — she says this is poor'], ['Power', 'explosive dives and jumps to save shots and claim crosses'], ['Agility', 'quick changes of direction across the goal'], ['Speed', 'rushing off the line to close down attackers'], ['Aerobic endurance', 'to recover between bursts and last 90 minutes'], ['Flexibility', 'range for diving and stretching saves']],
      nutrition: ['Around 2,000–2,200 kcal (female guideline plus training) with a small deficit to move BMI from 26 to the healthy range', 'Carbohydrate (pasta, rice, wholegrain bread) before training and matches, eaten 3–4 hours before kick-off', 'Lean protein (chicken, fish, eggs, beans) about 1.2–1.6 g/kg/day for muscle repair and power', 'Swap crisps, sweets and cake for fruit, yoghurt and nuts; avoid very late heavy meals before sleep', 'Iron and calcium (red meat, leafy greens, dairy) for oxygen transport and bone health', 'Ergogenic aids (spec): energy gels or bars at half-time/between sets (quick carbohydrate, may upset the stomach), protein drinks after training for repair, isotonic sports drinks during matches and hypertonic drinks after to restore glycogen'],
      modPriority: 'Smoking and alcohol are the priorities because both reduce aerobic capacity, reaction time and recovery, which are exactly what she needs for football.',
      barriers: ['Social drinking after work', 'Nicotine addiction', 'Shift work making training times and meals irregular'],
      smarter: 'Improve ruler-drop reaction time from 0.20 s to 0.18 s within six weeks, re-tested in week 6 and recorded in a training diary.',
      timeline: 'Six-week mesocycle in pre-season (preparation phase) of the football season macrocycle.'
    },
    {
      id: 'PP-2301', source: 'pearson', series: 'January 2023', name: 'Ben Martin', first: 'Ben', age: 42, sex: 'M',
      partA: 'Ben is 42 years old. He works in an office two days a week and he works from home three days a week. Ben works from 9 am to 5 pm each of these five days.\n\nBen used to train regularly at a gym and always maintained a good level of health and fitness. Over the last two years, Ben’s workload and family commitments have increased and he has not been able to do any fitness training. As a result, his fitness levels have decreased.\n\nBen has decided to work with a personal trainer to get back to his previous fitness levels. The personal trainer would like Ben to have a full health screening assessment before the first session.\n\nBen’s goal is to decrease his body fat percentage and improve his overall health and fitness.',
      occupation: 'Office worker', hours: '8 hours', distance: '35 miles from the office', travel: 'Train, when working in the office', activeJob: 'Not very active',
      activityFreq: 'None', activityType: 'No activity',
      diary: [
        d('1 × bowl of cereal with milk', 'Sandwiches with ham and cheese, 1 × banana, 1 × packet of crisps', 'Pizza, 1 × ice cream', '5 × biscuits, 1 × chocolate bar, 1 × chocolate cookie', '2 × cups of tea, 1 × can of cola, 2 × glasses of red wine', ['8am', '12.30pm', '6.30pm']),
        d('N/A (no breakfast)', 'Cheeseburger and chips', 'Lasagne and salad, 1 × ice cream', '1 × chocolate cookie, 1 × chocolate bar', '3 × cups of tea, 1 × hot chocolate and cream, 3 × pints of lager', ['—', '12.30pm', '7.30pm'])
      ],
      supplements: 'No', alcohol: 18, smoking: 0, stress: 'Work and family commitments', sleep: '8', sleepHours: 8,
      tests: { bp: [130, 95], rhr: 72, bmi: 26, whr: 0.98 },
      goal: 'To decrease my body fat percentage and improve my overall health and fitness levels.',
      focus: 'health', prevTrained: true,
      cautions: ['Previously trained — muscle memory, but reversibility means he must restart at a lower level', 'Limited time — home-working days can be used for short sessions'],
      analysis: {
        diet: 'high in sugar and saturated fat (biscuits, cookies, chocolate, ice cream, pizza, cheeseburger, hot chocolate with cream), skipped breakfast on day 2, few vegetables; no water recorded',
        exercise: 'no fitness training for two years — below the 150 minutes a week guideline and loss of fitness through reversibility',
        sedentary: 'office/home working 8 hours a day and travels by train — mostly sedentary, especially on home-working days'
      },
      components: [['Body composition', 'his goal is to reduce body fat percentage'], ['Aerobic endurance', 'burns calories and lowers diastolic blood pressure (95 mmHg)'], ['Muscular endurance', 'raises metabolism and rebuilds fitness'], ['Muscular strength', 'to regain previous gym strength and increase lean mass'], ['Flexibility', 'reduces stiffness from desk work']],
      nutrition: ['Around 2,000–2,200 kcal — a 300–500 kcal/day deficit from the 2,500 kcal male guideline to reduce body fat', 'Eat breakfast every day (porridge, eggs, wholegrain toast) to avoid mid-day snacking', 'Protein 1.2–1.6 g/kg/day (chicken, fish, eggs, Greek yoghurt) to preserve muscle while losing fat', 'Replace biscuits, cookies and chocolate with fruit, nuts or yoghurt; cut free sugar below 30 g/day', 'Wholegrain carbohydrates and vegetables for fibre (30 g/day) and vitamins', 'Drink 2–2.5 L of water a day; cut cola, hot chocolate and alcohol'],
      modPriority: 'Physical activity and stress are the priorities because inactivity caused by work/family pressure is behind his fat gain and raised diastolic BP; reducing alcohol (18 units) supports fat loss.',
      barriers: ['Workload and family commitments', 'Lack of time', 'Low motivation after two years without training'],
      smarter: 'Reduce body fat by 2% within six weeks (skinfold test), training four times a week and recording sessions in an app.',
      timeline: 'Six-week mesocycle at the start of a 6-month macrocycle to return to his previous fitness level.'
    },
    {
      id: 'PP-2306', source: 'pearson', series: 'June 2023', name: 'Anna Ward', first: 'Anna', age: 18, sex: 'F',
      partA: 'Anna is 18 years old. She enjoys playing tennis with her friends. Anna’s friends tell her that she is very good at tennis and that she should take it more seriously and enter competitions.\n\nAnna decides to enter a local tennis competition for the first time and she wins it easily. After the competition a professional tennis coach offers to coach Anna to play in higher level competitions in the future.\n\nThe tennis coach wants Anna to have a full health screening assessment and follow a new training programme before her next competition. The coach thinks Anna could have a successful future in the sport.\n\nAnna agrees to work with the tennis coach to see how far she can go in the sport. Anna’s aim is to win more competitions and to play at the highest possible level for Anna.',
      occupation: 'Office worker', hours: '8 hours', distance: '6 miles', travel: 'Car', activeJob: 'Not very active',
      activityFreq: '2 times per week (total 4 hours)', activityType: 'Tennis',
      diary: [
        d('2 × pieces of toast with jam', 'Ham and cheese sandwich, 1 × apple', 'Pizza', '1 × yoghurt, 1 × chocolate bar', '2 × cups of tea, 2 × bottles of lager, 2 litres of water', ['7am', '12.45pm', '7.30pm']),
        d('1 × bowl of cereal with milk', 'Tuna sandwich, 1 × banana, 1 × packet of crisps', 'Steak, potatoes and salad', '1 × chocolate bar, 1 × bag of peanuts, 1 × slice of cake', '3 × cups of tea, 1 × glass of wine, 2 litres of water', ['7am', '12.30pm', '7.30pm'])
      ],
      supplements: 'No', alcohol: 15, smoking: 5, stress: 'Meeting work deadlines', sleep: '7.5', sleepHours: 7.5,
      tests: { bp: [115, 74], rhr: 68, bmi: 27, whr: 0.98 },
      goal: 'To win more competitions and to play at the highest possible level for me.',
      focus: 'sport', sport: 'tennis (competitive)',
      cautions: ['Works full-time — training must fit around office hours'],
      analysis: {
        diet: 'reasonable main meals (tuna sandwich, steak, potatoes and salad, fruit) and good water intake (2 L), but too many processed and sugary foods (pizza, chocolate, cake, crisps, jam on white toast)',
        exercise: 'plays tennis twice a week (4 hours total) — meets the adult guideline, but not enough structured training for competitive tennis',
        sedentary: 'office job for 8 hours a day and drives 6 miles to work — sedentary outside tennis'
      },
      components: [['Agility', 'fast changes of direction around the court'], ['Speed', 'reaching drop shots and wide balls'], ['Power', 'serves and groundstrokes'], ['Reaction time', 'returning fast serves and volleys'], ['Aerobic endurance', 'long matches and recovery between points'], ['Coordination', 'hand–eye timing of every stroke']],
      nutrition: ['Around 2,000–2,300 kcal (female guideline, adjusted for training) with a small deficit to reduce BMI 27 and WHR 0.98', 'Complex carbohydrates (pasta, rice, oats) before matches to maintain glycogen through long rallies and sets', 'Protein 1.2–1.6 g/kg/day (chicken, fish, eggs, dairy) for repair', 'Swap chocolate, cake and crisps for fruit, nuts and yoghurt', 'Keep 2 L water a day and add 400–600 ml before matches; isotonic drink between sets in long matches', 'Ergogenic aids (spec): energy gels or bars at half-time/between sets (quick carbohydrate, may upset the stomach), protein drinks after training for repair, isotonic sports drinks during matches and hypertonic drinks after to restore glycogen'],
      modPriority: 'Smoking is the priority because it reduces oxygen transport and aerobic capacity for long matches; reducing alcohol (15 units, just over the guideline) and managing work stress also support performance.',
      barriers: ['Nicotine addiction and smoking at work breaks', 'Social drinking with friends', 'Full-time job limiting training time'],
      smarter: 'Improve Illinois agility run time by 0.5 seconds within six weeks, tested in week 6 and recorded in her training log, ready for her next tournament.',
      timeline: 'Six-week mesocycle in the preparation phase before her next competition, within a season-long macrocycle.'
    },
    {
      id: 'PP-2401', source: 'pearson', series: 'January 2024', name: 'Anton Geere', first: 'Anton', age: 20, sex: 'M',
      partA: 'Anton is 20 years old and is a full-time student. Anton has been competing for his local athletics club as a long-distance runner for the last three years. He has won many regional and national competitions.\n\nAnton enjoys the different competitions and has ambitions to compete in the Olympic Games in the future. Anton’s coach has said that Anton needs to be stricter with his lifestyle choices if he is to compete in the Olympics.\n\nAnton has decided to compete in his first marathon in six months’ time. The marathon will be the longest distance Anton has ever competed in. Anton’s coach has advised him to have a full health screening assessment before he starts to train for the marathon.\n\nAnton’s long-term goal is to compete in the Olympics as a marathon runner.',
      occupation: 'Student', hours: '3–4 hours of lessons a day', distance: '10 miles from college', travel: 'Car', activeJob: 'Not very active',
      activityFreq: 'Long-distance running (4 hours per week) and strength and conditioning sessions (2 hours per week)', activityType: 'Long-distance running and strength and conditioning sessions',
      diary: [
        d('1 × bowl of cereal with milk', 'Soup, 1 × banana', 'Pizza', '1 × packet of crisps, 1 × chocolate bar', '3 × glasses of water (750 ml)', ['7.40am', '12.45pm', '7.30pm']),
        d('1 × bowl of cereal with milk', 'Chicken salad, 1 × yogurt', 'Cheeseburger and chips', '1 × packet of crisps, 1 × chocolate bar', '4 × glasses of water (1 litre), 1 × bottle of beer', ['7.30am', '12.30pm', '7.30pm'])
      ],
      supplements: 'No', alcohol: 3, smoking: 1, stress: 'Competitions and college work/exams', sleep: '8.5', sleepHours: 8.5,
      tests: { bp: [118, 77], rhr: 58, bmi: 17, whr: 0.82 },
      goal: 'My long-term goal is to compete in the Olympics as a marathon runner.',
      focus: 'sport', sport: 'marathon running', endurance: true,
      cautions: ['Underweight (BMI 17) and only 750 ml–1 L of water a day — must increase energy and fluid before marathon training volume rises'],
      analysis: {
        diet: 'not enough energy or carbohydrate for marathon training (soup, salad, cereal) and too many processed foods (pizza, cheeseburger and chips, crisps, chocolate); far too little water',
        exercise: '6 hours a week of running and S&C — above adult guidelines, but not enough volume for a first marathon',
        sedentary: 'student who drives 10 miles to college — mostly sedentary outside training'
      },
      components: [['Aerobic endurance', 'the marathon relies almost entirely on the aerobic energy system'], ['Muscular endurance', 'leg muscles must keep contracting for 2–3 hours'], ['Speed', 'surges and a strong finish'], ['Flexibility', 'maintains stride and reduces injury risk with high mileage'], ['Core stability', 'keeps running posture efficient when fatigued'], ['Power', 'efficient stride and hill running (S&C)']],
      nutrition: ['Increase energy above 2,500 kcal (likely 3,000+ kcal as mileage rises) to move BMI 17 into the healthy range', 'Carbohydrate 7–10 g/kg/day (pasta, rice, potatoes, oats, bread) to keep glycogen stores full', 'Protein 1.2–1.4 g/kg/day (chicken, fish, eggs, dairy, pulses) for repair', 'Iron and B vitamins (red meat, fortified cereals, green vegetables) for oxygen transport and energy release', 'Increase water from 750 ml–1 L to 2.5–3 L a day; sports drinks on runs over 60–90 minutes', 'Ergogenic aids (spec): carbohydrate loading in the 36–48 hours before races over 90 minutes (10–12 g/kg/day; maximises glycogen, but can cause bloating/heaviness); energy gels and bars during long sessions (30–60 g carbohydrate per hour; quick energy, may upset the stomach); protein drinks after sessions for repair; isotonic drinks during, hypertonic after, hypotonic for rapid rehydration'],
      modPriority: 'Smoking (even one a day) is the priority because carbon monoxide reduces oxygen transport — critical for a marathon runner; stress management helps him balance college and competition.',
      barriers: ['Nicotine addiction', 'Pressure from competitions and exams', 'Social situations with alcohol at college'],
      smarter: 'Complete a 25 km long run at target marathon pace within six weeks, tracked with a GPS watch and logged in his training diary.',
      timeline: 'First six-week mesocycle of a six-month (marathon) macrocycle: base/preparation phase before specific marathon training and a taper.'
    },
    {
      id: 'PP-2406', source: 'pearson', series: 'June 2024', name: 'Sadie Shepherd', first: 'Sadie', age: 52, sex: 'F',
      partA: 'Sadie is 52 years old. She works in an office five days a week from 9 am till 5 pm each day. Sadie suffers from a medical condition that prevents her from taking part in any high intensity exercise.\n\nSadie’s lifestyle choices over the last five years have caused her to gain a lot of weight. The extra weight has had a negative impact on Sadie’s general health and wellbeing. Sadie has decided to go and see her doctor for some advice.\n\nSadie’s doctor gives her a full health screening assessment. Her doctor is very concerned about her health and wellbeing. Her doctor strongly advises Sadie to change her lifestyle but avoid high intensity exercise.\n\nSadie’s aim is to improve her lifestyle choices and lose a significant amount of weight.',
      occupation: 'Office worker', hours: '7 hours each day', distance: '1.5 miles', travel: 'Car', activeJob: 'Not very active',
      activityFreq: 'None', activityType: 'N/A',
      diary: [
        d('2 × bacon, 2 × sausages, egg, beans and toast', 'Ham sandwich, 1 × packet of crisps', 'Pizza and chips, ice cream', '1 × chocolate chip cookie, 2 × chocolate bars, 1 × yogurt, 1 × sausage roll', '2 × cups of hot chocolate, 2 × cans of cola, 2 × glasses of wine, 2 × bottles of beer', ['7am', '12.30pm', '7pm']),
        d('2 × bacon, 2 × sausages, egg, beans and toast', 'Cheeseburger and chips, 1 × yogurt, 1 × packet of crisps', 'Chinese takeaway', '2 × chocolate bars, 2 × donuts, 1 × chocolate cake, 1 × sausage sandwich', '2 × cups of hot chocolate, 2 × cans of cola, 2 × glasses of wine, 2 × bottles of beer', ['7.45am', '12.30pm', '7.30pm'])
      ],
      supplements: 'No', alcohol: 28, smoking: 6, stress: 'Work deadlines', sleep: '6', sleepHours: 6,
      tests: { bp: [150, 98], rhr: 82, bmi: 41, whr: 0.97 },
      goal: 'I would like to lose a significant amount of weight and improve my health and lifestyle.',
      focus: 'health', noHighIntensity: true,
      cautions: ['Medical condition: NO high-intensity exercise — keep to low–moderate intensity (max ~65% HRR, RPE ≤ 13) and use low-impact activities', 'Severely obese (BMI 41): protect joints (cycling, swimming, aqua aerobics, walking)'],
      analysis: {
        diet: 'extremely high in saturated fat and salt (two fried breakfasts, sausage roll, sausage sandwich, pizza, cheeseburger, chips, Chinese takeaway) and sugar (chocolate, donuts, cake, cola, hot chocolate); no fruit, vegetables or water',
        exercise: 'no physical activity at all — far below the 150 minutes a week guideline',
        sedentary: 'sits in an office 7 hours a day and drives only 1.5 miles to work, so her day is almost entirely sedentary'
      },
      components: [['Aerobic endurance', 'low-intensity aerobic work lowers BP/RHR and burns calories'], ['Body composition', 'to lose a significant amount of weight and reduce BMI 41'], ['Muscular endurance', 'raises metabolism and makes daily tasks easier'], ['Flexibility', 'improves mobility and reduces joint stiffness'], ['Core stability', 'supports posture and lower back while carrying extra weight']],
      nutrition: ['Reduce intake below 2,000 kcal — a 500–600 kcal/day deficit — for safe weight loss of about 0.5 kg a week', 'Replace the fried breakfast with porridge, wholegrain toast with egg, or fruit and low-fat yoghurt', 'Cut saturated fat below 20 g/day and salt below 6 g/day to help lower her blood pressure (150/98)', 'Lean protein (chicken, fish, beans, lentils) and vegetables at lunch and dinner instead of takeaways', 'At least 5 portions of fruit and vegetables and 30 g fibre a day for vitamins, minerals and fullness', 'Replace cola, hot chocolate, beer and wine with water: 6–8 glasses (1.5–2 L) a day'],
      modPriority: 'Smoking and alcohol are the priorities because, combined with her BMI of 41 and grade 1 hypertension, they put her at very high risk of CHD and stroke; low-intensity physical activity and stress management support weight loss.',
      barriers: ['Medical condition limiting the type of exercise she can do', 'Low confidence and embarrassment about exercising', 'Work stress triggering smoking, drinking and comfort eating', 'Nicotine/alcohol withdrawal'],
      smarter: 'Lose 4 kg in six weeks by walking or cycling at low intensity for 30 minutes on 5 days a week, measured by weekly weigh-ins and recorded in a diary.',
      timeline: 'Six-week mesocycle at the start of a 12-month macrocycle aimed at significant, safe weight loss under GP guidance.'
    },

    /* ───────────────────────── RA10 ORIGINAL PRACTICE CASES ───────────────────────── */
    {
      id: 'RA-01', source: 'ra10', series: 'RA10 practice', name: 'Priya Shah', first: 'Priya', age: 16, sex: 'F',
      partA: 'Priya is 16 years old and in Year 12 at sixth form. She plays centre for her county netball team and has been invited to trial for the regional academy in eight weeks’ time.\n\nPriya trains with her club twice a week and plays a match every Sunday. Her coach says she is skilful but often loses sharpness in the final quarter and is beaten to the ball by quicker players.\n\nPriya is also revising for mock exams and often studies late at night on her phone. She has started drinking energy drinks to stay awake.\n\nThe academy requires a full health screening assessment before the trial. Priya’s aim is to improve her speed, agility and stamina so she can be selected for the academy.',
      occupation: 'Sixth-form student', hours: '6 hours of lessons plus 2–3 hours of homework', distance: '2 miles', travel: 'Lift from parent', activeJob: 'Not very active',
      activityFreq: '3 times a week (2 × 1.5 hr club training, 1 match)', activityType: 'Netball',
      diary: [
        d('Nothing', 'Ham sandwich, 1 × packet of crisps', 'Chicken curry and rice', '1 × chocolate bar, 1 × can of energy drink', '1 × can of energy drink, 1 × glass of orange juice, 500 ml water', ['—', '12.30pm', '7pm']),
        d('Cereal bar', 'Pasta pot', 'Fish fingers, chips and peas', '1 × packet of sweets, 1 × apple, 1 × can of energy drink', '2 × cans of energy drink, 500 ml water', ['8am', '12.30pm', '6.30pm'])
      ],
      supplements: 'No', alcohol: 0, smoking: 0, stress: 'Mock exams and the academy trial', sleep: '6', sleepHours: 6,
      tests: { bp: [112, 70], rhr: 66, bmi: 21, whr: 0.76 },
      goal: 'To improve my speed, agility and stamina so I am selected for the regional netball academy.',
      focus: 'sport', sport: 'netball (centre)', youth: true,
      cautions: ['Aged 16 — use guideline of 60 minutes activity a day; creatine and high caffeine are not recommended for under-18s', 'Club training (2×) and Sunday matches must be included so total load is not excessive'],
      analysis: {
        diet: 'skips breakfast, relies on energy drinks (high sugar and caffeine), crisps and sweets; some decent meals (curry and rice, pasta, fish) but little fruit/veg and only 500 ml of water',
        exercise: 'three netball sessions a week — meets activity levels but not structured training for speed, agility and stamina',
        sedentary: 'long hours sitting in lessons and studying, and gets a lift to school'
      },
      components: [['Agility', 'a centre must change direction sharply to get free from her marker'], ['Speed', 'to beat opponents to the ball over short distances'], ['Aerobic endurance', 'centre covers the most court and must stay sharp in the final quarter'], ['Power', 'explosive jumps for interceptions and rebounds'], ['Reaction time', 'reacting to the pass and the opponent’s movement'], ['Balance', 'landing and pivoting under control (footwork rule)']],
      nutrition: ['Around 2,200–2,400 kcal (active 16-year-old girl) to fuel growth and training', 'Eat breakfast every day (porridge with banana, eggs on toast) for morning energy and concentration', 'Carbohydrate at every meal (rice, pasta, wholegrain bread) and a carb snack 1–2 hours before training', 'Protein 1.2–1.4 g/kg/day (chicken, fish, eggs, milk, beans) for repair and growth', 'Calcium and iron (dairy, leafy greens, red meat) — important for a growing female athlete', 'Ergogenic aids (spec): a banana or energy bar 1–2 hours before training, a protein drink (or milk) after sessions only if diet falls short, and an isotonic drink in sessions over an hour — replace high-caffeine energy drinks with water'],
      modPriority: 'Stress and sleep are the priorities because late-night phone use, exam pressure and energy drinks are causing fatigue that affects her final-quarter performance.',
      barriers: ['Exam workload and revision', 'Habit of using her phone late at night', 'Reliance on energy drinks to stay awake'],
      smarter: 'Reduce 5-0-5 agility time by 0.2 s and reach level 10 on the bleep test within eight weeks, before the academy trial, recorded in a training diary.',
      timeline: 'Six-week mesocycle in the preparation phase, finishing two weeks before the academy trial to allow a short taper.'
    },
    {
      id: 'RA-02', source: 'ra10', series: 'RA10 practice', name: 'Marcus Bennett', first: 'Marcus', age: 29, sex: 'M',
      partA: 'Marcus is 29 and works as a scaffolder. He plays rugby union in the back row for a semi-professional club and has been told he could earn a full-time contract if he becomes more powerful in the tackle and at the breakdown.\n\nMarcus trains with the club twice a week and plays on Saturdays. He drinks heavily after matches and at weekends, and has struggled with money worries since his partner lost her job.\n\nThe club’s strength and conditioning coach has asked Marcus to complete a full health screening assessment. Marcus is surprised that his BMI puts him in the “obese” category because he feels fit.\n\nMarcus’s aim is to increase his strength and power while reducing his body fat, so that he earns a professional contract next season.',
      occupation: 'Scaffolder', hours: '9 hours', distance: '8 miles', travel: 'Van', activeJob: 'Very active',
      activityFreq: '3 times a week (2 club sessions, 1 match)', activityType: 'Rugby union',
      diary: [
        d('4 × slices of white toast with butter', 'Meal-deal: chicken sandwich, crisps, energy drink', 'Steak pie, chips and peas', '2 × sausage rolls, 1 × protein bar', '3 × cups of tea with 2 sugars, 1 × energy drink, 1 litre water', ['6am', '12pm', '7pm']),
        d('Bacon roll', 'Chicken burrito', 'Chicken breast, rice and broccoli', '1 × chocolate bar, 1 × packet of crisps', '3 × cups of tea with 2 sugars, 1 litre water, 6 × pints of lager (after match)', ['6am', '12pm', '9pm'])
      ],
      supplements: 'Protein bars (occasionally)', alcohol: 30, smoking: 0, stress: 'Money worries at home', sleep: '6', sleepHours: 6,
      tests: { bp: [138, 88], rhr: 70, bmi: 31, whr: 0.92 },
      goal: 'To become stronger and more powerful and reduce my body fat so I earn a professional contract.',
      focus: 'sport', sport: 'rugby union (back row)',
      cautions: ['BMI overestimates fatness in muscular athletes — use skinfolds/bioimpedance to track body fat', 'Physically demanding job — manage total load and recovery'],
      analysis: {
        diet: 'high in saturated fat and salt (steak pie, sausage rolls, chips, bacon roll, crisps), lots of added sugar (sugary tea, energy drinks, chocolate), some good lean protein (chicken, rice, broccoli) and only 1 L of water',
        exercise: 'very active job plus three rugby sessions a week — well above guidelines, but no structured strength and power training',
        sedentary: 'not sedentary — scaffolding is very physically active'
      },
      components: [['Muscular strength', 'to win collisions in the tackle and breakdown'], ['Power', 'explosive leg drive into tackles and rucks'], ['Body composition', 'reduce fat mass while keeping lean mass'], ['Speed', 'acceleration to the breakdown'], ['Aerobic endurance', 'back-row players cover large distances in 80 minutes'], ['Muscular endurance', 'repeated tackles, scrums and rucks']],
      nutrition: ['Energy around 3,000–3,300 kcal on training days (very active job + rugby) with a small deficit only to reduce fat, not muscle', 'Protein 1.6–2.0 g/kg/day spread across 4–5 meals (eggs, chicken, fish, Greek yoghurt, milk) to build strength and preserve lean mass', 'Carbohydrate 5–7 g/kg/day from wholegrain sources timed around training and matches', 'Cut sausage rolls, pies, crisps and sugary tea/energy drinks to reduce saturated fat and sugar', 'Drink 3 L+ of water a day (physical outdoor job + training); rehydrate with 1.5 L per kg lost after matches instead of lager', 'Ergogenic aids (spec): protein drinks (about 20–25 g within 30–60 minutes after training to support muscle repair and power gains; costly and unnecessary if diet is adequate); energy gels or bars between heats/sessions for quick carbohydrate (may cause stomach upset); carbohydrate loading is NOT needed for short sprint events; isotonic drinks during training, hypotonic for rapid rehydration'],
      modPriority: 'Alcohol (30 units, mostly binge drinking after matches) is the priority because it impairs muscle protein synthesis and recovery and adds empty calories; stress management and sleep support recovery too.',
      barriers: ['Team drinking culture after matches', 'Money worries causing stress', 'Long, tiring working days'],
      smarter: 'Increase 1RM back squat from 140 kg to 150 kg and reduce sum of skinfolds by 5 mm within six weeks, recorded by the S&C coach.',
      timeline: 'Six-week mesocycle in the pre-season preparation phase of the rugby macrocycle.'
    },
    {
      id: 'RA-03', source: 'ra10', series: 'RA10 practice', name: 'Joan Whitaker', first: 'Joan', age: 67, sex: 'F',
      partA: 'Joan is 67 and retired from teaching two years ago. Since retiring she has spent most of her day reading and watching television. She has osteoarthritis in both knees, which makes walking for long periods painful.\n\nJoan’s doctor has told her she is at risk of developing type 2 diabetes. She has also had two minor falls in the garden over the last year.\n\nJoan looks after her grandchildren two afternoons a week and wants to be able to keep up with them. Her doctor has referred her to a local exercise referral scheme, where she will have a full health screening assessment.\n\nJoan’s aim is to stay independent, reduce her risk of diabetes and be active enough to play with her grandchildren.',
      occupation: 'Retired', hours: '—', distance: 'N/A', travel: 'Car or bus', activeJob: 'Not very active',
      activityFreq: 'None', activityType: 'N/A',
      diary: [
        d('2 × slices of white toast with marmalade', 'Cheese and pickle sandwich, 1 × packet of crisps', 'Shepherd’s pie and peas', '3 × biscuits, 1 × slice of cake', '4 × cups of tea with sugar, 1 × glass of sherry', ['9am', '1pm', '6pm']),
        d('Bowl of cornflakes', 'Tomato soup and white roll', 'Fish pie and carrots', '2 × biscuits, 1 × banana, 1 × scone with jam', '4 × cups of tea with sugar, 1 × glass of water', ['9am', '1pm', '6pm'])
      ],
      supplements: 'Cod liver oil', alcohol: 7, smoking: 0, stress: 'Worry about falling', sleep: '6.5', sleepHours: 6.5,
      tests: { bp: [145, 88], rhr: 78, bmi: 30, whr: 0.88 },
      goal: 'To stay independent, reduce my risk of diabetes and keep up with my grandchildren.',
      focus: 'health', older: true,
      cautions: ['Osteoarthritis of the knees — low-impact activities (aqua aerobics, swimming, cycling, chair-based exercise)', 'History of falls — include balance training and supervision; aged 65+ guideline', 'Grade 1 hypertension and diabetes risk — moderate intensity, monitored by RPE'],
      analysis: {
        diet: 'high in refined carbohydrate and sugar (white toast, cornflakes, biscuits, cake, scone with jam, sugary tea) — a risk for type 2 diabetes; few vegetables and very little water',
        exercise: 'no physical activity — below the 150 minutes a week guideline and missing the strength and balance work recommended for over-65s',
        sedentary: 'spends most of the day sitting reading and watching TV — highly sedentary'
      },
      components: [['Aerobic endurance', 'improves insulin sensitivity (reduces diabetes risk), BP and stamina for the grandchildren'], ['Balance', 'reduces her risk of further falls'], ['Muscular endurance', 'leg and core endurance for getting up, stairs and carrying'], ['Muscular strength', 'maintains muscle mass and supports arthritic knees'], ['Flexibility', 'maintains joint range of movement and reduces stiffness']],
      nutrition: ['Around 1,800–1,900 kcal (slightly below the 2,000 kcal female guideline) for gradual weight loss', 'Swap refined carbohydrate (white bread, cornflakes, cake, biscuits) for wholegrain, low-GI options (porridge, wholemeal bread) to control blood glucose', 'Cut sugar in tea and sugary snacks — free sugars below 30 g/day', 'Protein about 1.0–1.2 g/kg/day (fish, eggs, chicken, pulses) to slow age-related muscle loss', 'Calcium and vitamin D (dairy, oily fish, fortified foods, daylight) for bone health and falls prevention', 'Drink 6–8 glasses of water a day — older adults often feel less thirsty'],
      modPriority: 'Increasing physical activity is the priority because inactivity is the main cause of her diabetes risk, weight and falls; stress (fear of falling) is reduced by building balance and confidence.',
      barriers: ['Knee pain from osteoarthritis', 'Fear of falling', 'Long-term sedentary habits'],
      smarter: 'Complete two 45-minute aqua aerobics sessions and two balance classes a week, and improve stork-stand time by 5 seconds within six weeks, recorded by the exercise referral instructor.',
      timeline: 'Six-week mesocycle at the start of a 12-week exercise referral scheme within a long-term (lifelong) macrocycle.'
    },
    {
      id: 'RA-04', source: 'ra10', series: 'RA10 practice', name: 'Daniel Okafor', first: 'Daniel', age: 34, sex: 'M',
      partA: 'Daniel is 34 and works as a nurse on rotating night shifts at a busy hospital. He finds it hard to sleep during the day and drinks a lot of coffee to stay alert at work.\n\nDaniel has smoked since he was a teenager and often smokes on his breaks to cope with stressful shifts. He has gained weight over the last three years and gets out of breath on the stairs at work.\n\nDaniel’s ward is running a charity 10 km race in three months and he wants to take part. He has booked a full health screening assessment at his local gym.\n\nDaniel’s aim is to stop smoking, improve his fitness and complete the 10 km race without stopping.',
      occupation: 'Nurse (night shifts)', hours: '12-hour shifts, 3–4 per week', distance: '4 miles', travel: 'Car', activeJob: 'Quite active',
      activityFreq: 'None', activityType: 'N/A',
      diary: [
        d('Bowl of cereal (after night shift, 8am)', 'Sleeping', 'Takeaway pizza (5pm)', 'Crisps, chocolate bars and biscuits from the vending machine during the night', '6 × coffees, 2 × cans of cola, 500 ml water', ['8am', '—', '5pm']),
        d('Toast with peanut butter', 'Chicken wrap', 'Spaghetti bolognese', '1 × chocolate bar, 1 × banana', '4 × coffees, 1 × can of cola, 1 litre water, 2 × bottles of beer', ['10am', '2pm', '7pm'])
      ],
      supplements: 'No', alcohol: 10, smoking: 10, stress: 'Stressful shifts and short staffing', sleep: '5', sleepHours: 5,
      tests: { bp: [136, 86], rhr: 80, bmi: 27, whr: 0.97 },
      goal: 'To stop smoking, get fitter and complete a 10 km charity race without stopping.',
      focus: 'health', sport: '10 km run (recreational)',
      cautions: ['Rotating night shifts — the programme must be flexible (sessions on rest days and before/after shifts) and avoid hard sessions after a night shift', 'New runner — progress run time gradually to avoid shin and knee injuries'],
      analysis: {
        diet: 'irregular meals around shifts, vending-machine snacks (crisps, chocolate, biscuits), takeaway pizza and cola; some balanced meals on days off but high caffeine (4–6 coffees) and too little water',
        exercise: 'no planned exercise — below the 150 minutes a week guideline, although nursing involves some walking',
        sedentary: 'quite active at work, but drives to work and is inactive on days off while recovering from shifts'
      },
      components: [['Aerobic endurance', 'to run 10 km continuously'], ['Muscular endurance', 'leg endurance for repeated strides over 10 km'], ['Body composition', 'to reduce weight and central fat (WHR 0.97)'], ['Flexibility', 'to reduce injury risk as running volume increases'], ['Core stability', 'to maintain running posture']],
      nutrition: ['Around 2,200–2,300 kcal (a 200–300 kcal deficit from 2,500) for gradual fat loss while fuelling training', 'Plan regular meals around shifts and pack healthy night-shift snacks (fruit, yoghurt, nuts, wholemeal sandwiches) instead of the vending machine', 'Carbohydrate before runs (porridge, toast, banana) and protein after (chicken, eggs, milk) for recovery', 'Limit caffeine to about 3–4 coffees and none in the 6 hours before he needs to sleep', 'Drink 2–2.5 L of water a day; replace cola with water', 'Fruit and vegetables (5+ a day) for vitamin C and antioxidants — also helpful when stopping smoking'],
      modPriority: 'Smoking is the top priority because carbon monoxide reduces oxygen transport and limits aerobic endurance; stress and sleep management will support quitting and recovery.',
      barriers: ['Nicotine addiction and smoking to cope with stress on breaks', 'Night shifts disrupting sleep and routine', 'Tiredness and lack of time after long shifts'],
      smarter: 'Run 5 km continuously within six weeks (and 10 km by the race in three months), using a couch-to-10K plan recorded on a running app, and be smoke-free for 28 days.',
      timeline: 'First six-week mesocycle of a 12-week macrocycle leading to the charity 10 km race.'
    },
    {
      id: 'RA-05', source: 'ra10', series: 'RA10 practice', name: 'Ellie Morgan', first: 'Ellie', age: 21, sex: 'F',
      partA: 'Ellie is 21 and studies sports science at university. She is a competitive road cyclist and rides for the university team. Her target this summer is a 100-mile sportive with three long hill climbs.\n\nEllie has been cutting carbohydrates because she believes being lighter will make her faster up hills. Recently she has felt light-headed on long rides and has struggled to finish team sessions.\n\nEllie also enjoys university nights out with her teammates. Her coach has asked her to complete a full health screening assessment and to meet a nutrition adviser.\n\nEllie’s aim is to climb faster and finish the 100-mile sportive in under 6 hours.',
      occupation: 'University student', hours: '4 hours of lectures a day', distance: '3 miles', travel: 'Bicycle', activeJob: 'Not very active',
      activityFreq: '5 times a week (8–10 hours cycling)', activityType: 'Road cycling',
      diary: [
        d('Black coffee', 'Salad with tuna', 'Grilled chicken and vegetables', '1 × apple, 1 × protein bar', '2 × black coffees, 1.5 litres of water', ['8am', '1pm', '7pm']),
        d('2 × boiled eggs', 'Vegetable soup', 'Salmon and green beans', '1 × handful of almonds', '1 × black coffee, 1 litre of water, 4 × vodka and diet cola (night out)', ['8am', '1pm', '7pm'])
      ],
      supplements: 'Protein bars', alcohol: 20, smoking: 0, stress: 'Coursework deadlines', sleep: '7', sleepHours: 7,
      tests: { bp: [110, 70], rhr: 52, bmi: 20, whr: 0.74 },
      goal: 'To climb faster and finish a 100-mile sportive in under 6 hours.',
      focus: 'sport', sport: 'road cycling', endurance: true,
      cautions: ['Low-carbohydrate dieting with high training volume → low energy availability (light-headedness, fatigue); risk of RED-S — refer to nutrition adviser', 'High training volume — include recovery days'],
      analysis: {
        diet: 'very low in carbohydrate and energy for 8–10 hours of cycling a week (coffee for breakfast, salads, soup, protein, vegetables) — good protein and micronutrients but not enough fuel, causing light-headedness and poor session completion',
        exercise: '8–10 hours of cycling a week — far above guidelines and appropriate for her goal',
        sedentary: 'not sedentary — cycles to university and trains five times a week'
      },
      components: [['Aerobic endurance', 'a 100-mile ride is almost entirely aerobic'], ['Muscular endurance', 'quadriceps and glutes must work repeatedly for 6 hours and on long climbs'], ['Muscular strength', 'force on the pedals on steep gradients'], ['Core stability', 'stable pelvis and efficient power transfer on the bike'], ['Flexibility', 'hip and hamstring range for a comfortable riding position']],
      nutrition: ['Increase energy to around 2,600–3,000 kcal on long training days — her current intake is far too low for her volume', 'Carbohydrate 6–10 g/kg/day (oats, pasta, rice, bread, fruit) — reintroduce carbs at every meal and before/during rides', 'During rides over 90 minutes: 60 g carbohydrate per hour from gels, bars, bananas or sports drink', 'Protein 1.2–1.6 g/kg/day (already good — eggs, fish, chicken)', 'Iron and calcium (red meat, leafy greens, dairy) to protect oxygen transport and bone health', 'Ergogenic aids (spec): carbohydrate loading in the 36–48 hours before races over 90 minutes (10–12 g/kg/day; maximises glycogen, but can cause bloating/heaviness); energy gels and bars during long sessions (30–60 g carbohydrate per hour; quick energy, may upset the stomach); protein drinks after sessions for repair; isotonic drinks during, hypertonic after, hypotonic for rapid rehydration'],
      modPriority: 'Alcohol is the priority lifestyle change (20 units, binge-style on nights out) because it dehydrates and impairs recovery; correcting low carbohydrate intake is the most urgent nutritional change.',
      barriers: ['Belief that being lighter is always faster', 'University social life involving alcohol', 'Coursework deadlines'],
      smarter: 'Complete a 70-mile hilly ride in under 4 hours 15 minutes within six weeks, eating 60 g carbohydrate per hour, tracked on her bike computer.',
      timeline: 'Six-week mesocycle in the preparation phase of a summer macrocycle leading to the sportive (with a taper in the final week before the event).'
    },
    {
      id: 'RA-06', source: 'ra10', series: 'RA10 practice', name: 'Tom Fraser', first: 'Tom', age: 45, sex: 'M',
      partA: 'Tom is 45 and works from home as an IT manager. He spends most evenings gaming online and rarely leaves the house during the week.\n\nAt a routine check-up his GP measured high blood pressure and told Tom he needs to lose weight. Tom’s father had a heart attack at 52, and Tom is worried about his own heart health.\n\nTom has joined a local leisure centre, which provides a full health screening assessment for all new members.\n\nTom’s aim is to lose weight, lower his blood pressure and improve his general fitness.',
      occupation: 'IT manager (works from home)', hours: '9 hours', distance: '0 miles (home)', travel: 'N/A', activeJob: 'Not active',
      activityFreq: 'None', activityType: 'N/A',
      diary: [
        d('Bacon sandwich', '2 × slices of leftover pizza', 'Chicken korma, pilau rice and naan (takeaway)', '1 × large bag of crisps, 4 × biscuits', '4 × coffees with cream, 2 × cans of energy drink, 3 × bottles of beer', ['9am', '1pm', '8pm']),
        d('Nothing', 'Instant noodles, 1 × chocolate bar', 'Spaghetti carbonara', '1 × tub of ice cream, 1 × packet of sweets', '3 × coffees with cream, 1 × can of cola, 2 × glasses of red wine', ['—', '1pm', '8pm'])
      ],
      supplements: 'No', alcohol: 22, smoking: 0, stress: 'Work deadlines', sleep: '6', sleepHours: 6,
      tests: { bp: [142, 94], rhr: 84, bmi: 33, whr: 1.04 },
      goal: 'To lose weight, lower my blood pressure and improve my general fitness.',
      focus: 'health',
      cautions: ['Family history of heart attack and grade 1 hypertension — GP clearance; moderate intensity with gradual progression', 'Obese (BMI 33) — low-impact start (cycling, swimming, walking)'],
      analysis: {
        diet: 'very high in saturated fat, salt and sugar (bacon sandwich, pizza, korma and naan, carbonara, crisps, biscuits, ice cream, sweets, energy drinks, coffee with cream); no fruit or vegetables and no water',
        exercise: 'no physical activity — below the 150 minutes a week guideline',
        sedentary: 'works from home at a desk and games in the evening — extremely sedentary, with no commute'
      },
      components: [['Aerobic endurance', 'lowers BP and RHR and reduces CHD risk (family history)'], ['Body composition', 'reduces BMI 33 and high WHR 1.04'], ['Muscular endurance', 'raises metabolic rate'], ['Muscular strength', 'increases lean mass to support fat loss'], ['Flexibility', 'reduces stiffness and back pain from sitting']],
      nutrition: ['Reduce intake to about 1,900–2,000 kcal (a 500–600 kcal deficit from 2,500) for 0.5 kg a week loss', 'Eat breakfast (porridge, eggs) and plan home-cooked lunches instead of leftovers and noodles', 'Cut saturated fat (cream, carbonara, korma, pizza) below 30 g/day and salt below 6 g/day — the DASH approach to lower BP', 'Lean protein and at least 5 portions of fruit and vegetables a day (potassium helps lower BP)', 'Replace energy drinks, cola and beer with water — 2–2.5 L a day', 'Limit coffee to 3–4 a day without cream'],
      modPriority: 'Physical activity is the priority because extreme inactivity, with a family history of heart attack, is his biggest risk; reducing alcohol (22 units) and managing stress also lower blood pressure.',
      barriers: ['Gaming habit and long screen time', 'Working from home with no reason to leave the house', 'Low fitness and embarrassment at the gym'],
      smarter: 'Lose 3 kg and reduce resting blood pressure below 140/90 within six weeks by exercising four times a week, recorded with a home BP monitor and fitness app.',
      timeline: 'Six-week mesocycle at the start of a 12-month macrocycle focused on reducing CHD risk.'
    },
    {
      id: 'RA-07', source: 'ra10', series: 'RA10 practice', name: 'Aisha Rahman', first: 'Aisha', age: 19, sex: 'F',
      partA: 'Aisha is 19 and boxes as an amateur in the featherweight division. She has her first national championship bout in ten weeks.\n\nBefore her last fight Aisha lost 4 kg in five days by sitting in a sauna and not drinking water. She felt weak and dizzy in the ring and lost on points.\n\nAisha works part-time in a phone shop and trains at her boxing gym five evenings a week. Her new coach wants her to have a full health screening assessment before planning her fight camp.\n\nAisha’s aim is to make weight safely and win her national championship bout.',
      occupation: 'Part-time sales assistant', hours: '5 hours', distance: '3 miles', travel: 'Bus', activeJob: 'Not very active',
      activityFreq: '5 times a week (1.5–2 hrs boxing training)', activityType: 'Boxing',
      diary: [
        d('Porridge with honey', 'Chicken and rice', 'Salmon, sweet potato and broccoli', '1 × protein bar, 1 × apple', '1.5 litres water, 1 × coffee', ['7am', '12.30pm', '7pm']),
        d('2 × eggs on toast', 'Tuna pasta salad', 'Chicken stir-fry with noodles', '1 × chocolate bar, 1 × packet of crisps', '1.5 litres water, 1 × can of cola', ['7am', '12.30pm', '8pm'])
      ],
      supplements: 'No', alcohol: 0, smoking: 0, stress: 'Making weight and the upcoming fight', sleep: '7', sleepHours: 7,
      tests: { bp: [118, 76], rhr: 56, bmi: 22, whr: 0.74 },
      goal: 'To make weight safely and win my national championship bout.',
      focus: 'sport', sport: 'amateur boxing',
      cautions: ['Previous rapid dehydration in a sauna — dangerous (cramps, heat illness, impaired performance); weight must be managed gradually through diet', 'Five evening sessions already — avoid overtraining during the fight camp'],
      analysis: {
        diet: 'generally well balanced (porridge, chicken and rice, salmon, vegetables) with some processed snacks; the main issue is dangerous dehydration to make weight before fights',
        exercise: 'trains five times a week — well above guidelines',
        sedentary: 'not sedentary overall, although she travels by bus and works on a shop floor'
      },
      components: [['Aerobic endurance', 'to recover between rounds and keep work-rate high for three rounds'], ['Speed', 'fast hand speed for combinations'], ['Power', 'punching power from legs, hips and core'], ['Reaction time', 'slipping and countering punches'], ['Agility', 'footwork and moving off the ropes'], ['Muscular endurance', 'keeping hands up and punching throughout each round']],
      nutrition: ['Make weight gradually: a small deficit of 300–500 kcal/day (about 1,700–1,900 kcal) over the ten-week camp, never by dehydration', 'Carbohydrate around 5–7 g/kg/day timed around training to fuel high-intensity rounds', 'Protein 1.6–2.0 g/kg/day to keep muscle while losing fat', 'Drink 2–3 L of water a day; after weigh-in rehydrate with 1.5 L per kg lost and electrolytes', 'Iron and calcium (red meat, leafy greens, dairy) — important for female athletes in a calorie deficit', 'Ergogenic aids (spec): energy gels or bars at half-time/between sets (quick carbohydrate, may upset the stomach), protein drinks after training for repair, isotonic sports drinks during matches and hypertonic drinks after to restore glycogen'],
      modPriority: 'Stress management is the lifestyle priority because anxiety about making weight drove her dangerous sauna use; her other lifestyle factors are already positive.',
      barriers: ['Pressure and fear of not making weight', 'Old habits of crash dieting and dehydrating', 'Balancing part-time work with fight camp'],
      smarter: 'Lose 2 kg of body mass gradually over six weeks (no more than 0.5 kg a week) while keeping training quality, recorded by the coach at weekly weigh-ins.',
      timeline: 'First six weeks of a ten-week fight-camp macrocycle (preparation phase), followed by a sharpening phase and taper.'
    },
    {
      id: 'RA-08', source: 'ra10', series: 'RA10 practice', name: 'Gareth Lloyd', first: 'Gareth', age: 55, sex: 'M',
      partA: 'Gareth is 55 and runs a dairy farm. He works long, physical days starting at 5 am, seven days a week. He has smoked 20 cigarettes a day since he was 16 and drinks most evenings at his local pub.\n\nGareth’s daughter has signed him up for a 5 km parkrun so that they can do it together in two months. Gareth gets out of breath walking up hills on the farm and has a smoker’s cough.\n\nGareth’s GP has asked him to have a full health screening assessment before he starts training.\n\nGareth’s aim is to complete the 5 km parkrun with his daughter and to cut down on smoking and drinking.',
      occupation: 'Dairy farmer', hours: '11 hours', distance: '0 miles (lives on farm)', travel: 'Walks around the farm / tractor', activeJob: 'Very active',
      activityFreq: 'None (outside work)', activityType: 'N/A',
      diary: [
        d('Full English breakfast with fried bread', 'Pork pie and crisps', 'Roast beef, roast potatoes and vegetables', '2 × slices of fruit cake', '4 × cups of tea with sugar, 5 × pints of bitter', ['7am', '12pm', '7pm']),
        d('Bacon and egg sandwich', 'Cheese and onion pasty', 'Steak and kidney pie with mash', '1 × chocolate bar, 1 × packet of crisps', '4 × cups of tea with sugar, 4 × pints of bitter', ['7am', '12pm', '7pm'])
      ],
      supplements: 'No', alcohol: 35, smoking: 20, stress: 'Milk prices and farm finances', sleep: '6', sleepHours: 6,
      tests: { bp: [155, 95], rhr: 79, bmi: 29, whr: 1.02 },
      goal: 'To complete a 5 km parkrun with my daughter and cut down on smoking and drinking.',
      focus: 'health', sport: '5 km parkrun',
      cautions: ['Grade 1 hypertension, 20 cigarettes a day and smoker’s cough — GP clearance before training; begin with walk–jog intervals', 'Very physical job, seven days a week — sessions must be short and recovery planned'],
      analysis: {
        diet: 'very high in saturated fat and salt (fried breakfast, pork pie, pasty, steak and kidney pie, crisps) and sugar (sugary tea, cake, chocolate); some vegetables at dinner but no water',
        exercise: 'no exercise outside work; his farm work is physically active, but he does no planned aerobic training',
        sedentary: 'not sedentary at work, but inactive in the evenings at the pub'
      },
      components: [['Aerobic endurance', 'to run 5 km and stop getting breathless on hills'], ['Muscular endurance', 'legs must keep running for 5 km'], ['Body composition', 'reduce central fat (WHR 1.02)'], ['Flexibility', 'reduces stiffness from heavy manual work and lowers injury risk']],
      nutrition: ['Around 2,500–2,800 kcal because of his very physical job, but with fewer high-fat foods to reduce BMI and WHR', 'Swap the fried breakfast for porridge or eggs on wholemeal toast; replace pies and pasties with lean meat sandwiches and salad', 'Cut saturated fat below 30 g/day and salt below 6 g/day to help lower blood pressure', '5+ portions of fruit and vegetables a day (vitamin C, antioxidants — important for a smoker)', 'Drink 2.5–3 L of water a day for physical outdoor work; cut sugar in tea', 'Reduce bitter from 4–5 pints a night — each pint is about 180–200 kcal'],
      modPriority: 'Smoking is the top priority (20 a day, smoker’s cough, breathlessness) because it is the biggest risk to his heart and lungs and directly limits his aerobic endurance; reducing alcohol (35 units) is the second priority.',
      barriers: ['40 years of smoking — strong nicotine addiction', 'Social life centred on the pub', 'Long working days, seven days a week', 'Financial stress'],
      smarter: 'Complete 20 minutes of continuous walk–jog intervals within six weeks and reduce to 10 cigarettes a day, recorded in a diary checked by his daughter.',
      timeline: 'Six-week mesocycle within an eight-week macrocycle leading to the parkrun, as part of a longer health plan.'
    },
    {
      id: 'RA-09', source: 'ra10', series: 'RA10 practice', name: 'Megan Hughes', first: 'Megan', age: 26, sex: 'F',
      partA: 'Megan is 26 and had her first baby nine months ago. She is on maternity leave and has been cleared by her GP to return to exercise. Before her pregnancy she played hockey and went to spin classes three times a week.\n\nMegan has been sleeping badly because the baby wakes during the night, and she often snacks on biscuits and chocolate to keep her energy up. She feels low in confidence about her body and her fitness.\n\nMegan has joined a gym with a crèche, which offers a full health screening assessment.\n\nMegan’s aim is to lose the weight she gained during pregnancy, rebuild her core strength and return to playing hockey next season.',
      occupation: 'On maternity leave', hours: '—', distance: 'N/A', travel: 'Pushes the pram to the shops', activeJob: 'Quite active (looking after a baby)',
      activityFreq: 'Daily 20-minute walks with the pram', activityType: 'Walking',
      diary: [
        d('Toast with chocolate spread', 'Cheese sandwich, 1 × yoghurt', 'Chicken pasta bake', '4 × biscuits, 1 × chocolate bar, 1 × banana', '3 × cups of coffee, 1 litre of water', ['7am', '12.30pm', '6.30pm']),
        d('Granola with yoghurt', 'Jacket potato with tuna', 'Fish fingers, chips and beans', '1 × slice of cake, 3 × biscuits', '3 × cups of coffee, 1 litre of water, 1 × glass of wine', ['8am', '1pm', '6.30pm'])
      ],
      supplements: 'Vitamin D', alcohol: 4, smoking: 0, stress: 'Lack of sleep and looking after the baby', sleep: '5 (broken)', sleepHours: 5,
      tests: { bp: [122, 80], rhr: 74, bmi: 28, whr: 0.86 },
      goal: 'To lose the weight I gained during pregnancy, rebuild my core strength and return to hockey next season.',
      focus: 'health', sport: 'hockey (return to play)',
      cautions: ['Postnatal: GP clearance received; rebuild core and pelvic floor gradually before high-impact work; avoid exercises that cause doming of the abdominal wall', 'Broken sleep — keep sessions short and flexible (crèche times)'],
      analysis: {
        diet: 'balanced main meals (pasta bake, jacket potato with tuna) but frequent sugary snacks (chocolate spread, biscuits, cake, chocolate) used for energy; 1 L of water is too low',
        exercise: 'daily 20-minute pram walks (about 140 minutes a week) — just below the 150-minute guideline and no strength work',
        sedentary: 'fairly active looking after a baby, but no structured exercise since pregnancy'
      },
      components: [['Core stability', 'rebuild abdominal and pelvic floor strength after pregnancy'], ['Aerobic endurance', 'to burn calories and rebuild fitness for hockey'], ['Body composition', 'lose weight gained during pregnancy'], ['Muscular endurance', 'carrying the baby and repeated movements in hockey'], ['Agility', 'needed later for returning to hockey']],
      nutrition: ['Around 1,800–1,900 kcal (about a 300–500 kcal deficit; more if breastfeeding) for gradual weight loss', 'Swap biscuits, cake and chocolate spread for fruit, nuts, yoghurt and wholegrain toast for steadier energy', 'Protein at every meal (eggs, fish, chicken, beans) to help rebuild muscle and keep her full', 'Iron, calcium and vitamin D (red meat, leafy greens, dairy, continue vitamin D) — needs are higher postnatally', 'Increase water to 2 L+ a day (more if breastfeeding)', 'Limit coffee to 3 a day and keep alcohol low'],
      modPriority: 'Stress and sleep are the priorities because broken sleep and low mood are driving her sugary snacking and low confidence; increasing structured activity supports weight loss and mood.',
      barriers: ['Childcare and broken sleep', 'Low body confidence', 'Tiredness leading to comfort snacking'],
      smarter: 'Lose 3 kg and hold a plank for 60 seconds within six weeks by attending three crèche gym sessions a week, recorded in a training app.',
      timeline: 'Six-week mesocycle in a general preparation phase of a macrocycle leading to the start of the hockey season.'
    },
    {
      id: 'RA-10', source: 'ra10', series: 'RA10 practice', name: 'Jamal Price', first: 'Jamal', age: 17, sex: 'M',
      partA: 'Jamal is 17 and plays point guard for his college basketball team. He has been invited to a trial for a regional basketball academy in seven weeks.\n\nJamal trains with his college team three times a week and plays a game every Saturday. His coach says he needs a better vertical jump and quicker first step to compete at academy level.\n\nJamal often plays video games until 2 am and eats a lot of fast food with his friends after college. He sometimes vapes when he is with friends.\n\nThe academy has asked for a full health screening assessment. Jamal’s aim is to improve his jumping, speed and agility so that he is selected for the regional academy.',
      occupation: 'College student', hours: '6 hours', distance: '3 miles', travel: 'Bus', activeJob: 'Not very active',
      activityFreq: '4 times a week (3 × 1.5 hr training, 1 game)', activityType: 'Basketball',
      diary: [
        d('Nothing', 'Chicken burger and fries', 'Spaghetti bolognese', '1 × energy drink, 1 × packet of sweets', '2 × energy drinks, 1 × can of cola, 500 ml water', ['—', '1pm', '8pm']),
        d('Cereal with milk', 'Fried chicken and fries (with friends)', 'Chicken curry and rice', '1 × chocolate bar, 1 × packet of crisps', '1 × energy drink, 1 litre water', ['8am', '4pm', '9pm'])
      ],
      supplements: 'No', alcohol: 0, smoking: 0, vaping: 'Occasionally with friends', stress: 'College assignments and the academy trial', sleep: '6.5', sleepHours: 6.5,
      tests: { bp: [124, 78], rhr: 62, bmi: 23, whr: 0.82 },
      goal: 'To improve my jumping, speed and agility so I am selected for the regional basketball academy.',
      focus: 'sport', sport: 'basketball (point guard)', youth: true,
      cautions: ['Aged 17 — 60 minutes activity a day guideline; no creatine and limited caffeine for under-18s', 'Plyometrics must be introduced with low volume and good landing technique to protect growing joints'],
      analysis: {
        diet: 'skips breakfast; high in saturated fat and salt (burgers, fried chicken, fries) and sugar (energy drinks, sweets, cola, chocolate); some balanced meals (bolognese, curry and rice) but low water',
        exercise: 'four basketball sessions a week — meets the 60-minutes-a-day guideline on those days but no structured power or speed training',
        sedentary: 'long hours gaming and sitting at college; travels by bus'
      },
      components: [['Power', 'vertical jump for rebounds, shots and blocks'], ['Speed', 'a quick first step to beat defenders'], ['Agility', 'changing direction while dribbling and defending'], ['Reaction time', 'reacting to passes, steals and defenders'], ['Coordination', 'dribbling and passing under pressure'], ['Aerobic endurance', 'to repeat high-intensity efforts across four quarters']],
      nutrition: ['Around 2,800–3,000 kcal (active, growing 17-year-old) from regular meals', 'Eat breakfast every day (porridge, eggs, wholegrain toast) to fuel morning college and training', 'Carbohydrate (rice, pasta, bread, potatoes) before training and games; protein 1.2–1.6 g/kg/day (chicken, fish, eggs, milk, beans) for power development and growth', 'Swap fried chicken, fries and sweets for healthier options with friends (wraps, grilled chicken, rice dishes)', 'Calcium and vitamin D (milk, yoghurt, oily fish) for bone growth', 'Ergogenic aids (spec): a banana or energy bar 1–2 hours before training, a protein drink (or milk) after sessions only if diet falls short, and an isotonic drink in sessions over an hour — replace high-caffeine energy drinks with water'],
      modPriority: 'Sleep and stress are the priorities because gaming until 2 am cuts his sleep below the 8–10 hours teenagers need, which limits recovery, growth and reaction time; stopping vaping protects his lungs.',
      barriers: ['Gaming habit late at night', 'Peer pressure (fast food and vaping with friends)', 'College workload'],
      smarter: 'Increase vertical jump by 4 cm and reduce 20 m sprint time by 0.1 s within six weeks, re-tested before the academy trial and recorded by his coach.',
      timeline: 'Six-week mesocycle in the preparation phase before the academy trial, within the college basketball season macrocycle.'
    }
  ];

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  const pronoun = (c) => c.sex === 'F' ? { s: 'she', o: 'her', p: 'her', S: 'She', P: 'Her' } : { s: 'he', o: 'him', p: 'his', S: 'He', P: 'His' };
  const isSmoker = (c) => c.smoking > 0;
  const lc = (t) => t.charAt(0).toLowerCase() + t.slice(1);

  function testInterpretations(c) {
    const p = pronoun(c);
    const [sys, dia] = c.tests.bp;
    const bp = U2.bpCategory(sys, dia), rhr = U2.rhrCategory(c.tests.rhr), bmi = U2.bmiCategory(c.tests.bmi), whr = U2.whrCategory(c.tests.whr, c.sex);
    const lifestyleLinks = [];
    if (isSmoker(c)) lifestyleLinks.push('smoking (nicotine narrows blood vessels)');
    if (c.alcohol > 14) lifestyleLinks.push('alcohol above 14 units');
    if (c.stress) lifestyleLinks.push('daily stress');
    if (c.tests.bmi >= 25) lifestyleLinks.push('excess body weight');
    if (/salt|saturated/i.test(c.analysis.diet)) lifestyleLinks.push('a diet high in salt and saturated fat');
    const out = [];
    out.push(`Blood pressure ${sys}/${dia} mmHg = ${lc(bp.label)} (compare: optimal < 120/80; high ≥ 140/90): ${bp.risk}.` + (lifestyleLinks.length && sys >= 130 ? ` Likely contributors: ${lifestyleLinks.join(', ')}.` : ''));
    out.push(`Resting heart rate ${c.tests.rhr} bpm = ${lc(rhr.label)}: ${rhr.note}.` + (c.tests.rhr >= 80 ? ` ${p.P} heart has to beat more often to supply oxygen, linked to inactivity${isSmoker(c) ? ', smoking' : ''}${c.stress ? ' and stress' : ''}.` : c.tests.rhr < 60 ? ` A low RHR shows a strong, efficient heart (higher stroke volume) from training.` : ''));
    out.push(`BMI ${c.tests.bmi} = ${lc(bmi.label)} (healthy 18.5–24.9): ${bmi.risk}.` + (c.tests.bmi >= 30 && /rugby|scaffold/i.test(c.sport + c.occupation) ? ' BMI does not distinguish muscle from fat, so a muscular athlete may be wrongly classed as obese — use skinfolds as well.' : ''));
    out.push(`Waist-to-hip ratio ${c.tests.whr} = ${lc(whr.label)} for a ${c.sex === 'F' ? 'woman (low risk ≤ 0.80, high > 0.85)' : 'man (low risk ≤ 0.95, high > 1.0)'}: ${whr.label === 'Low risk' ? 'healthy fat distribution' : 'fat stored around the waist (apple shape) increases the risk of CHD, hypertension and type 2 diabetes'}.`);
    return out;
  }

  function lifestyleInterpretations(c) {
    const p = pronoun(c);
    const g = U2.NORMS.guidelines;
    const teen = c.age < 18;
    const out = [];
    out.push(`Diet: ${c.analysis.diet}. Effects: weight gain, raised LDL cholesterol and blood pressure, and increased risk of CHD and type 2 diabetes; low energy and poor concentration.`);
    out.push(`Exercise / physical activity: ${c.analysis.exercise}. (Guideline: ${c.age < 19 ? g.paChild : c.age >= 65 ? g.paOlder : g.paAdult}.)`);
    out.push(`Sedentary lifestyle: ${c.analysis.sedentary}. Long periods of sitting increase the risk of obesity, CHD, type 2 diabetes, poor posture and back pain.`);
    if (isSmoker(c)) out.push(`Smoking: ${c.smoking} cigarette${c.smoking === 1 ? '' : 's'} a day — there is no safe level. Carbon monoxide binds to haemoglobin and reduces oxygen transport (lower aerobic endurance); nicotine raises HR and BP; tar damages the lungs (risk of lung cancer, COPD, bronchitis); increases risk of CHD and stroke.`);
    else if (c.vaping) out.push(`Smoking: does not smoke cigarettes (positive), but vapes occasionally — vapes still contain nicotine (addictive, raises HR and BP) and their long-term effects on the lungs are not fully known.`);
    else out.push(`Smoking: non-smoker — a positive lifestyle factor that protects ${p.p} heart and lungs.`);
    if (c.alcohol > g.alcoholUnits) out.push(`Alcohol: ${c.alcohol} units a week is ${c.alcohol >= 28 ? 'at least double' : 'above'} the guideline of 14 units a week. Effects: empty calories (7 kcal/g) causing weight gain, dehydration, poor sleep and recovery, raised BP, and long-term liver disease (cirrhosis), CHD and some cancers.`);
    else if (c.alcohol > 0) out.push(`Alcohol: ${c.alcohol} units a week is within the 14-unit guideline${teen ? ', although under-18s are advised not to drink' : ''}; still adds empty calories and can affect sleep and recovery.`);
    else out.push(`Alcohol: drinks no alcohol — a positive lifestyle factor.`);
    if (c.stress) out.push(`Stress: experiences daily stress (${c.stress.toLowerCase()}). Effects: raised HR and BP (adrenaline and cortisol), poor sleep, anxiety, low mood, comfort eating/smoking/drinking, and long-term risk of hypertension and CHD.`);
    else out.push(`Stress: no daily stress reported — a positive factor for mental well-being and blood pressure.`);
    const rec = teen ? g.sleepTeen : g.sleepAdult;
    if (c.sleepHours < rec[0]) out.push(`Sleep: ${c.sleep} hours a night is below the recommended ${rec[0]}–${rec[1]} hours. Effects: fatigue, poor concentration and reaction time, impaired recovery and adaptation, raised appetite hormones (weight gain) and weakened immunity.`);
    else out.push(`Sleep: ${c.sleep} hours a night is within the recommended ${rec[0]}–${rec[1]} hours — a positive factor for recovery and well-being.`);
    return out;
  }

  // Techniques named in the Unit 2 specification (A3) come first in each list.
  const MOD_TECHNIQUES = {
    activity: ['at home (home workouts, active chores, exercise apps)', 'at work (stairs, walking meetings, breaking up sitting every 30 minutes, lunchtime walks)', 'during leisure time (joining a class, club, walking group, parkrun or a GP exercise referral scheme)', 'method of transport (walk or cycle, get off the bus a stop early, park further away)'],
    smoking: ['NHS smoking services (free local stop-smoking support)', 'NHS smoking helpline', 'nicotine replacement therapy (patches, gum, lozenges, inhalator)', 'Quit Kit support packs', 'acupuncture'],
    alcohol: ['counselling', 'self-help groups (e.g. Alcoholics Anonymous)', 'alternative treatments (e.g. acupuncture, hypnotherapy)', 'practical steps: drink diary, drink-free days, lower-strength drinks and smaller measures'],
    stress: ['assertiveness training', 'goal setting', 'time management', 'physical activity', 'positive self-talk', 'relaxation and breathing techniques', 'meditation', 'alternative therapies (e.g. massage, yoga)', 'changes to work-life balance'],
    sleep: ['a regular bedtime routine (sleep hygiene)', 'no screens for an hour before bed', 'avoiding caffeine after mid-afternoon and alcohol before bed', 'a dark, quiet, cool bedroom']
  };

  function modificationContent(c) {
    const p = pronoun(c);
    const items = [];
    const g = U2.NORMS.guidelines;
    const lowActivity = /none|no activity|n\/a|below|only two|no physical|no planned|no regular|no exercise|no fitness/i.test(c.analysis.exercise);
    if (lowActivity) items.push(`Physical activity — strategies ${MOD_TECHNIQUES.activity.join('; ')}. Justify for ${c.first}: ${c.occupation.toLowerCase()} — e.g. ${/car|van/i.test(c.travel) ? 'replace short car journeys with walking' : 'add active travel'}${c.cautions && c.cautions.length ? '; activities chosen to respect ' + p.p + ' health condition' : ''}; working towards the ${c.age >= 65 ? 'older-adult' : c.age < 19 ? '60-minutes-a-day' : '150-minutes-a-week'} guideline.`);
    if (isSmoker(c)) items.push(`Smoking: ${MOD_TECHNIQUES.smoking.slice(0, 4).join('; ')}. Justify: ${c.smoking} a day — quitting improves oxygen transport within weeks and reduces CHD/stroke risk; NRT reduces cravings while ${p.s} breaks the habit.`);
    if (c.vaping) items.push(`Vaping: set a quit date and use the NHS Quit Smoking app/support; avoid situations with friends where ${p.s} vapes; nicotine addiction would make a later switch to cigarettes more likely.`);
    if (c.alcohol > g.alcoholUnits) items.push(`Alcohol: ${MOD_TECHNIQUES.alcohol.slice(0, 4).join('; ')}. Justify: reducing from ${c.alcohol} to ≤ 14 units removes empty calories, improves sleep and recovery and helps lower blood pressure.`);
    if (c.stress) items.push(`Stress (${c.stress.toLowerCase()}): ${MOD_TECHNIQUES.stress.slice(0, 4).join('; ')}. Justify: lowers HR, BP and cortisol, and removes the trigger for ${isSmoker(c) ? 'smoking, ' : ''}${c.alcohol > 14 ? 'drinking, ' : ''}comfort eating and poor sleep.`);
    const rec = c.age < 18 ? g.sleepTeen : g.sleepAdult;
    if (c.sleepHours < rec[0]) items.push(`Sleep (optional extra): ${MOD_TECHNIQUES.sleep.join('; ')} — to reach ${rec[0]}–${rec[1]} hours for recovery.`);
    items.push(`Barriers to change (spec: time, cost, transport, location) for ${c.first}: ${c.barriers.join('; ')}. Overcome them with short sessions that fit around commitments, free/low-cost options, activities close to home or work, and support from family, friends or a coach.`);
    items.push(`Prioritising (significance): ${c.modPriority}`);
    return items;
  }

  function nutritionContent(c) {
    const items = c.nutrition.slice();
    const g = U2.NORMS.guidelines;
    items.unshift(`Recommended daily allowance (RDA) of energy: guideline ${c.sex === 'F' ? g.kcalFemale : g.kcalMale} kcal for ${c.sex === 'F' ? 'women' : 'men'}, adjusted to ${c.first}’s goal (${/lose|weight|fat/i.test(c.goal) ? 'calorie deficit for weight/fat loss' : c.focus === 'sport' ? 'increased to match training demands' : 'energy balance'}).`);
    items.push('Balanced macronutrient split for general health: carbohydrate ~50% of energy (mostly complex/wholegrain), fat ≤ 35% (saturated ≤ 11%), protein ~15% (0.75 g/kg/day minimum; more for athletes).');
    if (c.focus === 'sport') items.push('Sport-specific scenario: ergogenic aids from the specification (energy gels and bars, protein drinks, carbohydrate loading) and sports drinks (isotonic, hypertonic, hypotonic) are rewardable when justified with positive and negative effects and recommended timings.');
    return items;
  }

  function methodLine(comp, reason, c) {
    const info = U2.COMPONENTS[comp];
    if (!info) return '';
    let methods = info.methods;
    if (c.noHighIntensity || c.older) methods = methods.filter(m => !/ballistic|plyometric|interval training \(anaerobic|hollow|acceleration/i.test(m));
    const pick = methods[0];
    return `${comp}: ${pick}${methods[1] ? ' (or ' + methods[1].charAt(0).toLowerCase() + methods[1].slice(1) + ')' : ''} — ${reason}.`;
  }

  /* Intensity zones (Karvonen / heart rate reserve) by client type and week. */
  function aerobicZone(c, w) {
    const zones = c.noHighIntensity ? [[45, 55], [50, 60], [55, 65]]
      : c.older || c.focus === 'health' ? [[50, 60], [55, 65], [60, 70]]
      : c.endurance ? [[65, 75], [70, 80], [70, 85]] : [[60, 70], [65, 75], [70, 80]];
    const [lo, hi] = zones[w];
    return `${lo}–${hi}% HRR (${U2.karvonen(c.age, c.tests.rhr, lo)}–${U2.karvonen(c.age, c.tests.rhr, hi)} bpm)`;
  }
  function rpe(c, w) { return c.noHighIntensity ? ['RPE 10–11', 'RPE 11–12', 'RPE 12–13'][w] : ['RPE 11–12', 'RPE 12–13', 'RPE 13–14'][w]; }

  function session(comp, c, w) {
    const lowImpact = c.noHighIntensity || c.older || c.tests.bmi >= 35 || /arthritis|postnatal/i.test(c.partA + (c.cautions || []).join(' '));
    const aerobicMode = lowImpact ? ['brisk walk', 'stationary cycle', 'swim / aqua aerobics'][w] : c.endurance && /cycl/i.test(c.sport) ? 'road ride' : c.endurance ? 'continuous run' : 'jog / cycle';
    switch (comp) {
      case 'Aerobic endurance':
      case 'Body composition':
        if (c.endurance) return [`Continuous ${aerobicMode} 40 min @ ${aerobicZone(c, 0)}`, `Fartlek ${aerobicMode} 45 min (steady @ ${aerobicZone(c, 1)} with 6 × 1 min surges @ 85% HRR)`, `Interval training 6 × 5 min @ 85–90% HRR, 1:1 work:rest (≈ ${U2.karvonen(c.age, c.tests.rhr, 85)}–${U2.karvonen(c.age, c.tests.rhr, 90)} bpm)`][w];
        if (c.focus === 'sport') return [`Continuous ${aerobicMode} 20 min @ ${aerobicZone(c, 0)}`, `Fartlek 25 min @ ${aerobicZone(c, 1)} with short sprints`, `Interval training 8 × 1 min @ 85–90% HRR, 1:1 work:rest`][w];
        return [`Continuous ${aerobicMode} 20 min @ ${aerobicZone(c, 0)}, ${rpe(c, 0)}`, `Continuous ${aerobicMode} 30 min @ ${aerobicZone(c, 1)}, ${rpe(c, 1)}`, `Continuous ${aerobicMode} 40 min @ ${aerobicZone(c, 2)}, ${rpe(c, 2)}`][w];
      case 'Muscular endurance':
        return c.noHighIntensity || c.older
          ? ['Circuit training (low intensity) 6 stations × 30 s work / 60 s rest × 1 circuit, bodyweight/resistance bands, RPE 11', 'Fixed resistance machines 2 × 12 @ 40–50% 1RM (60 s rest)', 'Fixed resistance machines 3 × 15 @ 50% 1RM (60 s rest)'][w]
          : ['Circuit training 8 stations × 30 s work / 30 s rest × 2 circuits', 'Fixed resistance machines 3 × 15 @ 50–60% 1RM (45 s rest)', 'Circuit training 10 stations × 40 s work / 20 s rest × 3 circuits'][w];
      case 'Muscular strength':
        return c.older ? ['Fixed resistance machines 2 × 10 @ 60% 1RM (chair-supported squats, leg press)', 'Fixed resistance machines 2 × 10 @ 65% 1RM', 'Fixed resistance machines 3 × 8 @ 70% 1RM'][w]
          : ['Free weights 3 × 8 @ 70% 1RM (technique focus, 2 min rest)', 'Free weights 4 × 6 @ 80% 1RM (2–3 min rest)', 'Free weights 5 × 4 @ 85–90% 1RM (3 min rest)'][w];
      case 'Flexibility':
        return c.older || c.noHighIntensity ? ['Static stretching (active) 6 stretches × 2 × 15 s', 'Static stretching (active and passive) 8 stretches × 2 × 20 s', 'Static stretching 8 stretches × 3 × 30 s'][w]
          : ['Static stretching 8 stretches × 2 × 20 s after session', 'Static stretching 8 stretches × 3 × 30 s', 'PNF stretching (hamstrings, hip flexors, shoulders) 3 × 6 s contract / 20 s stretch'][w];
      case 'Core stability':
        return ['Core stability: plank 3 × 20 s, glute bridge 2 × 10, bird-dog 2 × 8 each side', 'Core stability: plank 3 × 30 s, side plank 2 × 20 s, Swiss-ball bridge 3 × 10', 'Core stability: plank 3 × 45 s, side plank 3 × 30 s, Swiss-ball rollouts 3 × 10'][w];
      case 'Speed':
        return ['Acceleration sprints 6 × 20 m @ 95–100% effort, full recovery (1:5 work:rest)', 'Acceleration sprints 8 × 30 m @ 100% effort, 2 min rest', 'Hollow sprints 6 × (20 m sprint – 20 m jog – 20 m sprint), 3 min rest'][w];
      case 'Power':
        return c.youth ? ['Plyometrics (low volume): 3 × 5 squat jumps, 3 × 5 box jumps (low box), 2 min rest', 'Plyometrics: 4 × 5 box jumps, 3 × 6 bounds, 2 min rest', 'Plyometrics: 4 × 6 box jumps, 4 × 6 bounds, 3 × 5 medicine-ball throws'][w]
          : ['Plyometrics: 3 × 6 squat jumps, 3 × 6 box jumps, 2 min rest', 'Plyometrics: 4 × 6 bounding, 4 × 6 box jumps, 3 × 6 medicine-ball throws', 'Plyometrics: 4 × 8 depth jumps, 4 × 8 bounding, 4 × 6 medicine-ball throws'][w];
      case 'Agility':
        return ['SAQ ladder and cone drills 6 drills × 3 reps @ 100% effort, full recovery', 'SAQ drills 8 drills × 3 reps including Illinois-style patterns', 'Sport-specific SAQ drills 10 × 3 reps reacting to coach’s signal'][w];
      case 'Balance':
        return ['Balance training: single-leg stand 3 × 20 s each leg (support available)', 'Balance training: wobble board 3 × 30 s, heel-to-toe walk 3 × 5 m', 'Balance training: single-leg stand eyes closed 3 × 30 s, Swiss-ball seated balance 3 × 45 s'][w];
      case 'Coordination':
        return ['Coordination drills: hand–eye ball drills 10 min', 'Coordination drills: ladder footwork + ball handling 15 min', 'Sport-specific coordination drills under fatigue 20 min'][w];
      case 'Reaction time':
        return ['Reaction drills: ruler/ball drops 3 × 10 reps', 'Reaction drills: reaction-ball and start-to-signal sprints 4 × 10', 'Sport-specific reaction drills (e.g. shot-stopping / return of serve) 5 × 10'][w];
      default: return comp;
    }
  }

  function programme(c) {
    const comps = c.components.map(x => x[0]);
    const main = comps[0];
    const second = comps[1] === 'Body composition' ? comps[0] : comps[1];
    const rest = comps.slice(2);
    const pick = (i) => rest[i % Math.max(1, rest.length)] || 'Flexibility';
    const flex = comps.includes('Flexibility') ? 'Flexibility' : null;
    const hasSportDays = c.focus === 'sport' && /team|club|college/i.test(c.partA);
    const plan = [];
    for (let w = 0; w < 3; w++) {
      const days = {};
      const sess = (cmp) => session(cmp === 'Body composition' ? 'Aerobic endurance' : cmp, c, w);
      const add = (day, parts) => { days[day] = parts.filter(Boolean).join(' + '); };
      if (c.focus === 'health') {
        const aerobic = comps.find(x => x === 'Aerobic endurance') || main;
        const resist = comps.find(x => /Muscular (endurance|strength)/.test(x)) || pick(0);
        const extra = comps.find(x => x !== aerobic && x !== resist && !/Body composition|Flexibility|Core stability/.test(x)) || (comps.includes('Core stability') ? 'Core stability' : 'Flexibility');
        add('Monday', [sess(aerobic), flex && w > 0 ? session('Flexibility', c, w) : null]);
        add('Tuesday', w >= 2 ? [sess(extra)] : ['Rest']);
        add('Wednesday', [sess(resist), comps.includes('Core stability') && extra !== 'Core stability' ? session('Core stability', c, w) : null]);
        add('Thursday', w >= 1 ? [sess(aerobic)] : ['Rest']);
        add('Friday', [sess(aerobic), flex ? session('Flexibility', c, w) : null]);
        add('Saturday', w === 0 ? ['Rest'] : w === 1 ? ['Active recovery: 20 min gentle walk'] : [sess(resist)]);
        add('Sunday', ['Rest']);
      } else {
        add('Monday', [sess(main), flex ? session('Flexibility', c, w) : null]);
        add('Tuesday', hasSportDays ? ['Team training (skills and tactics)'] : [sess(second)]);
        add('Wednesday', [sess(pick(0)), comps.includes('Core stability') ? session('Core stability', c, w) : null]);
        add('Thursday', hasSportDays ? ['Team training'] : (w === 0 ? ['Rest'] : [sess(pick(1))]));
        add('Friday', [sess(second), w >= 1 ? sess(pick(2)) : null]);
        add('Saturday', /match|game|competition|competes/i.test(c.partA) ? ['Match / competition'] : [sess(main)]);
        add('Sunday', ['Rest']);
      }
      plan.push(days);
    }
    return plan;
  }

  function programmeText(c) {
    const plan = programme(c);
    return ['Week 1', 'Week 3', 'Week 6'].map((wk, i) => wk + ': ' + Object.entries(plan[i]).map(([dn, s]) => `${dn.slice(0, 3)} — ${s}`).join('; ')).join('\n');
  }

  function justificationContent(c) {
    const p = pronoun(c);
    const P = U2.PRINCIPLES;
    const comps = c.components.map(x => x[0]);
    return [
      `FITT — Frequency: sessions rise from ${c.focus === 'health' ? '3 to 5' : '4 to 5'} a week so ${c.first} adapts without excessive fatigue; Intensity: aerobic work set by heart rate (${aerobicZone(c, 0)} in week 1 → ${aerobicZone(c, 2)} in week 6) or RPE, resistance by %1RM; Time: duration/sets increase each week; Type: methods matched to ${comps.slice(0, 3).join(', ').toLowerCase()}.`,
      `Specificity: methods target ${p.p} goal (“${c.goal}”) — ${c.components.slice(0, 2).map(x => x[0].toLowerCase() + ' (' + x[1] + ')').join('; ')}.`,
      `Overload: time, intensity and frequency increase gradually from week 1 to week 6 (about 10% a week) so ${p.p} body keeps adapting.`,
      `Progression: starts at ${p.p} current level (${c.activityFreq.toLowerCase().startsWith('none') ? 'currently inactive' : c.activityFreq.toLowerCase()}) and builds step by step to avoid injury and drop-out.`,
      `Individual needs: ${(c.cautions || []).join('; ') || 'programme fits ' + p.p + ' age, fitness and commitments'}.`,
      `Adaptation: e.g. ${comps.includes('Aerobic endurance') ? 'cardiac hypertrophy and increased stroke volume lower RHR and BP' : 'increased muscle fibre recruitment and phosphocreatine stores improve power and speed'}; adaptations occur during rest days.`,
      `Reversibility: rest days are never more than two in a row, so gains are not lost; ${c.prevTrained ? 'he has already experienced reversibility after two years off, so the plan must restart at a lower level' : 'consistency is built into the weekly routine'}.`,
      `Variation: different methods and venues (e.g. ${comps.filter(x => x !== 'Body composition').slice(0, 3).map(x => (U2.COMPONENTS[x] || { methods: [x] }).methods[0].toLowerCase()).join(', ')}) prevent boredom, plateaus and overuse injury.`,
      `Rest and recovery: at least one full rest day each week and 24–48 h between hard sessions for the same muscles/systems${c.sleepHours < 7 ? '; improving sleep is essential because adaptation happens during recovery' : ''}.`,
      `Aims and objectives: the aim is ${c.first}’s goal (“${c.goal}”); objectives are the measurable steps towards it — completing every planned session, working in the target intensity zone and re-testing in week 6.`,
      `SMARTER goal (Specific, Measurable, Achievable, Realistic, Time-related, Exciting, Recorded): ${c.smarter}`,
      `Periodisation: ${c.timeline} Each week is a microcycle; weeks 1–6 form a mesocycle.`,
      `Resources required: ${resourcesFor(c)}.`
    ];
  }

  function resourcesFor(c) {
    const comps = c.components.map(x => x[0]);
    const r = ['heart-rate monitor or watch (to keep to the training zone)', 'training diary/app'];
    if (comps.some(x => /strength|Muscular endurance/.test(x))) r.push(c.noHighIntensity || c.older ? 'resistance bands and fixed resistance machines' : 'gym with free weights and fixed resistance machines');
    if (comps.includes('Core stability')) r.push('mat and Swiss ball');
    if (comps.some(x => /Agility|Speed|Reaction/.test(x))) r.push('cones, speed ladder, reaction balls and a running track/space');
    if (comps.includes('Power')) r.push('plyometric boxes and medicine balls');
    if (/swim|aqua/i.test(c.sport + JSON.stringify(c.cautions || []))) r.push('swimming pool');
    if (/cycl/i.test(c.sport || '')) r.push('road bike / turbo trainer and bike computer');
    r.push('a qualified instructor/coach to supervise and review progress');
    return r.join(', ');
  }

  /* ── Activity definitions (structure identical in every Pearson series) ── */
  const ACTIVITIES = [
    { n: 1, marks: 12, aim: 'B', topic: 'Interpreting lifestyle factors and screening results', verb: 'Interpret', q: (c) => `Interpret the lifestyle factors and screening information for ${c.name}.`,
      bands: ['1–3', '4–6', '7–9', '10–12'],
      traits: [
        { name: 'Identification and description of lifestyle factors', weight: 35, top: 'All relevant lifestyle factors (diet, exercise, smoking, alcohol, stress, sleep, sedentary lifestyle) identified from the screening information and comprehensively described.' },
        { name: 'Interpretation of the impact of lifestyle factors on health and well-being', weight: 35, top: 'Detailed, analytical interpretation of the impact of each factor, specifically relevant to the individual’s health and well-being.' },
        { name: 'Interpretation of the health monitoring test results', weight: 30, top: 'All four tests (blood pressure, RHR, BMI, waist-to-hip ratio) correctly interpreted against normative data, with reasons linked to the individual’s lifestyle.' }
      ],
      guidance: 'Every Pearson scenario allows all seven lifestyle factors and all four health monitoring tests to be interpreted. Learners who only list factors, or leave out the tests, cannot get past Band 1–2 for those traits. Results must be compared with normative data, and incorrect interpretation of a test (e.g. calling a BMI of 26 “healthy”) is not credited.',
      content: (c) => lifestyleInterpretations(c).concat(testInterpretations(c), [`Links between factors (top-band analysis): e.g. ${c.stress ? 'stress → ' + (isSmoker(c) ? 'smoking/' : '') + (c.alcohol > 14 ? 'drinking/' : '') + 'comfort eating → weight gain → raised BP' : 'diet and inactivity → body composition → BP/RHR'}; overall impact on ${c.first}’s goal: ${c.goal}`]) },
    { n: 2, marks: 12, aim: 'A', topic: 'Lifestyle modification techniques', verb: 'Provide and justify', q: (c) => `Provide and justify lifestyle modification techniques for ${c.name}.`,
      bands: ['1–3', '4–6', '7–9', '10–12'],
      traits: [
        { name: 'Proposal of lifestyle modification techniques', weight: 30, top: 'At least one technique taken from the specification for at least three identified negative lifestyle factors (from stress, alcohol, smoking and physical activity), specifically relevant to the individual.' },
        { name: 'Justification of techniques', weight: 50, top: 'Each technique justified in detail in relation to the individual’s lifestyle, work and commitments, including the barriers to change.' },
        { name: 'Links to the lifestyle analysis and prioritisation', weight: 20, top: 'Proposals systematically link to the lifestyle factor analysis and show understanding of significance — which change matters most and why.' }
      ],
      guidance: 'Only techniques for factors the client actually has are rewardable (e.g. no smoking-cessation marks for a non-smoker). Generic advice (“stop smoking”, “drink less”) without a named technique is Band 1. Barriers to change are needed for Band 4 justification.',
      content: (c) => modificationContent(c) },
    { n: 3, marks: 8, aim: 'C', topic: 'Nutritional guidance', verb: 'Provide and justify', q: (c) => `Provide and justify nutritional guidance for ${c.name} to meet ${pronoun(c).p} specific requirements.`,
      bands: ['1–2', '3–4', '5–6', '7–8'],
      traits: [
        { name: 'Proposal of nutritional guidance', weight: 40, top: 'Guidance specifically relevant to the individual covering recommended daily calories, all three macronutrients (with quantities and food sources), micronutrients (with sources) and hydration — plus ergogenic aids if the scenario is sport-specific.' },
        { name: 'Justification of the guidance', weight: 60, top: 'Each recommendation justified in detail in relation to the individual’s dietary requirements, health and training/fitness goal.' }
      ],
      guidance: 'Quantities matter: “eat more protein” is less credit than “1.2–1.6 g/kg/day of protein from chicken, fish and eggs”. Weight-loss clients must be placed in a calorie deficit. Ergogenic aids are only rewardable when the scenario is sport-specific and should include side-effects.',
      content: (c) => nutritionContent(c) },
    { n: 4, marks: 8, aim: 'D', topic: 'Training methods', verb: 'Propose and justify', q: (c) => `Propose and justify different training methods that meet ${c.name}’s training needs.`,
      bands: ['1–2', '3–4', '5–6', '7–8'],
      traits: [
        { name: 'Proposal of training methods', weight: 40, top: 'At least one training method taken from the specification for at least four different components of fitness relevant to the individual.' },
        { name: 'Justification of training methods', weight: 60, top: 'Each method justified in detail for the individual’s training needs, stating which method is most appropriate and why.' }
      ],
      guidance: 'Methods must be named from the specification. “Weight training” is NOT accepted — say free weights, fixed resistance machines or circuit training. Naming a component (e.g. “flexibility”) without a method (e.g. static or PNF stretching) earns no method credit. Several methods for one component only count as one component.',
      content: (c) => c.components.map(([comp, why]) => methodLine(comp, why, c)).filter(Boolean).concat([`Most appropriate method and why: ${methodLine(c.components[0][0], c.components[0][1], c).replace(/\.$/, '')} — the priority for ${c.first} because it links most directly to ${pronoun(c).p} goal.`]) },
    { n: 5, marks: 6, aim: 'E', topic: 'Designing a six-week programme', verb: 'Design', q: (c) => `Design weeks 1, 3 and 6 of a six-week fitness training programme for ${c.name}.`,
      bands: ['1–2', '3–4', '5–6'],
      traits: [
        { name: 'Relevance to the individual’s fitness requirements', weight: 40, top: 'Sessions for at least three different relevant components of fitness, using methods from the specification.' },
        { name: 'Application of the principles of training', weight: 60, top: 'FITT applied in full for every session — including a specific intensity (%MHR/bpm or RPE for aerobic work; %1RM or RPE for resistance work) — with clear progression, variation, rest days and individual needs.' }
      ],
      guidance: 'An intensity value must be stated for most sessions: %MHR/%HRR or bpm for aerobic work, %1RM for strength/muscular endurance (RPE also accepted). Week 6 must be visibly harder than week 1. Rest days should be shown.',
      content: (c) => [`Example model programme (heart-rate zones calculated for ${c.first}: MHR = 220 − ${c.age} = ${U2.maxHr(c.age)} bpm; RHR ${c.tests.rhr} bpm; Karvonen THR = ((MHR − RHR) × %) + RHR):`].concat(programmeText(c).split('\n'), ['Each session: 10-minute warm-up (pulse raiser, mobility, dynamic stretches) and 10-minute cool-down (gradual decrease + static stretches).']) },
    { n: 6, marks: 14, aim: 'E', topic: 'Justifying the programme using principles of training', verb: 'Justify', q: (c) => `Justify the fitness training programme that you have designed for ${c.name}, considering the principles of fitness training.`,
      bands: ['1–3', '4–7', '8–11', '12–14'],
      traits: [
        { name: 'Justification using the principles of fitness training', weight: 70, top: 'FITT justified in detail in relation to the programme, plus at least six additional principles (specificity, overload, progression, reversibility, rest and recovery, adaptation, variation, individual needs) justified for this individual.' },
        { name: 'Justification of programme design', weight: 30, top: 'Aims and objectives, SMARTER goals (every letter in order), periodisation and resources required are all justified for the individual.' }
      ],
      guidance: 'Describing what happens on each day is not justification — each principle must be explained and linked to the client. SMART/SMARTER must be written out in full (no missing letters, ideally in order).',
      content: (c) => justificationContent(c) }
  ];

  function levelDescriptors(act) {
    const n = act.bands.length;
    const words = n === 3
      ? ['Limited relevance; isolated or generic points; little or no application of FITT/intensity.', 'Generally relevant; some application to the individual; FITT partly applied.', 'Specific relevance throughout; thorough, accurate application with intensities and progression.']
      : ['Limited: isolated, generic or inaccurate points with little relevance to the individual.', 'Some: a few relevant points, partly applied to the individual, with superficial justification.', 'Good: most relevant points covered and applied to the individual, with clear justification.', 'Comprehensive: all key points covered, specifically relevant to the individual, justified in detail and prioritised/linked.'];
    return act.bands.map((m, i) => ({ level: i + 1, marks: m, descriptor: words[i] }));
  }

  function clientSummary(c) {
    const t = c.tests;
    const days = c.diary.map((day, i) => `Day ${i + 1}: breakfast ${day.breakfast}; lunch ${day.lunch}; dinner ${day.dinner}; snacks ${day.snacks}; fluids ${day.fluid}.`).join(' ');
    return `${c.name}, ${c.age}, ${c.sex === 'F' ? 'female' : 'male'}. ${c.partA.replace(/\n+/g, ' ')} Occupation: ${c.occupation} (${c.hours}; ${c.distance}; travels by ${c.travel}; ${c.activeJob}). Activity: ${c.activityFreq} — ${c.activityType}. Food diary — ${days} Supplements: ${c.supplements}. Alcohol: ${c.alcohol} units/week. Smoking: ${c.smoking ? c.smoking + ' a day' : 'No'}${c.vaping ? ' (vapes: ' + c.vaping + ')' : ''}. Stress: ${c.stress || 'No'}. Sleep: ${c.sleep} hours. Tests: BP ${t.bp[0]}/${t.bp[1]} mmHg, RHR ${t.rhr} bpm, BMI ${t.bmi}, WHR ${t.whr}${(t.extra || []).map(e => ', ' + e[0] + ' ' + e[1]).join('')}. Goal: ${c.goal}`;
  }

  function buildActivityQuestions(c) {
    return ACTIVITIES.map((act) => ({
      id: `${c.id}-A${act.n}`,
      case_id: c.id,
      activity: act.n,
      learning_aim: act.aim,
      topic: act.topic,
      command_verb: act.verb,
      marks: act.marks,
      type: 'extended_levels',
      origin: c.source,
      series: c.series,
      spec_code: '31525H',
      unit: 'BTEC Level 3 Sport Unit 2',
      scenario: c.source === 'pearson' ? `Pearson past paper — ${c.series} set task (31525H). ${c.name}, ${c.age}.` : `RA10 practice set task. ${c.name}, ${c.age}.`,
      question: act.q(c),
      source_material: { type: 'client', case_id: c.id, title: `${c.name} — case study and lifestyle questionnaire` },
      client_summary: clientSummary(c),
      mark_scheme: {
        instruction: `Pearson Unit 2 trait-based levels marking. Place the answer in a band for each trait, then use best fit weighted by the trait percentages (${act.traits.map(t => t.weight + '%').join(' / ')}). Bands: ${act.bands.map((b, i) => 'Band ' + (i + 1) + ' = ' + b).join(', ')}; 0 = no rewardable material.`,
        traits: act.traits.map(t => ({ name: t.name, weight: t.weight, top_band: t.top })),
        indicative_content: act.content(c),
        level_descriptors: levelDescriptors(act),
        additional_guidance: act.guidance,
        examiner_principles: act.traits.map(t => `Band ${act.bands.length} for “${t.name}” (${t.weight}%): ${t.top}`)
      }
    }));
  }

  window.U2 = Object.assign(window.U2 || {}, { CASES, ACTIVITIES, buildActivityQuestions, programme, clientSummary, testInterpretations, lifestyleInterpretations, MOD_TECHNIQUES });
})();
