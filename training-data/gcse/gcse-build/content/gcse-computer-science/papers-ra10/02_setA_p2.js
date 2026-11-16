  /* ======================= SET A · PAPER 2 · Computational thinking, algorithms and programming ======================= */
  paper('A', 2, 'Set A');

  // ---------------- SECTION A (50 marks) ----------------
  Q('1', 'a', 2, 'G', 'A school is designing a program for its canteen so students can order lunch in advance. Explain how abstraction could be used when designing the program.',
    '1 mark each:\n• Removing unnecessary detail / focusing only on what is needed…\n• …eg the menu items, prices and order times are kept; details such as the colour of the trays or the layout of the kitchen are ignored');
  Q('1', 'b', 2, 'G', 'Describe how decomposition could be used when designing the canteen program.',
    '1 mark each:\n• Breaking the problem into smaller sub-problems…\n• …eg logging in, choosing meals, paying, confirming the order – each can be written and tested separately');
  Q('2', '', 5, 'G', 'Complete a trace table for the algorithm. Show the values of n, total and count and any output.',
    '1 mark each:\n• total and count both set to 0 at the start\n• n takes the values 3, 6, 9\n• total takes the values 3, 9, 18\n• count takes the values 1, 2, 3\n• Output: 6 (accept 6.0)', { ctx: [code(['count = 0', 'total = 0', 'for n = 3 to 9 step 3', '    total = total + n', '    count = count + 1', 'next n', 'print(total / count)'])] });
  Q('3', 'a', 3, 'G', 'Show the first pass of a bubble sort to put the list 7, 3, 9, 2, 5 into ascending order.',
    '1 mark each:\n• 7 and 3 swapped → 3, 7, 9, 2, 5\n• 7 and 9 not swapped; 9 and 2 swapped → 3, 7, 2, 9, 5\n• 9 and 5 swapped → end of first pass: 3, 7, 2, 5, 9');
  Q('3', 'b', 3, 'G', 'Show how a merge sort would put the list 8, 4, 6, 1 into ascending order.',
    '1 mark each:\n• Split into [8, 4] [6, 1] and then [8] [4] [6] [1]\n• Merged into [4, 8] and [1, 6]\n• Merged into [1, 4, 6, 8]');
  Q('3', 'c', 3, 'G', 'Show how a binary search would find the number 31 in the list 4, 9, 15, 22, 31, 40, 52.',
    '1 mark each:\n• The middle item 22 is compared with 31; 31 is bigger so 22 and the items to its left are discarded\n• The middle of 31, 40, 52 is 40; 31 is smaller so 40 and 52 are discarded\n• 31 is compared with 31 – found\nGuidance: Allow a different choice of middle item for an even-sized list if applied consistently.');
  Q('3', 'd', 1, 'G', 'State one advantage of a binary search compared with a linear search.',
    '• Faster / fewer comparisons for large (sorted) lists // halves the data each time');
  Q('4', 'a', 4, 'J', 'Complete the truth table for P = (A OR B) AND NOT C.',
    '1 mark for each two correct rows (rows in order A B C):\n• 000 → 0, 001 → 0\n• 010 → 1, 011 → 0\n• 100 → 1, 101 → 0\n• 110 → 1, 111 → 0', { ctx: [grid(['A', 'B', 'C', 'P'], [['0', '0', '0', ''], ['0', '0', '1', ''], ['0', '1', '0', ''], ['0', '1', '1', ''], ['1', '0', '0', ''], ['1', '0', '1', ''], ['1', '1', '0', ''], ['1', '1', '1', '']])] });
  Q('4', 'b', 2, 'J', 'A heater (H) switches on when the room is cold (C) and the window (W) is not open. Write a Boolean expression for H.',
    '1 mark each:\n• C AND …\n• … NOT W  →  H = C AND NOT W');
  Q('5', 'a', 4, 'I', 'A program asks how many meals to order. It accepts whole numbers from 1 to 20 inclusive. Give one example of each type of test data: normal, boundary, invalid and erroneous.',
    '1 mark each:\n• Normal: any whole number from 2 to 19, eg 7\n• Boundary: 1 or 20 (accept 0 or 21 if described as just outside the boundary and expected to be rejected)\n• Invalid: a whole number outside 1–20, eg 35 or -2\n• Erroneous: data of the wrong type, eg "five" / 3.5');
  Q('5', 'b', 4, 'I', 'Explain two ways the canteen program’s code could be made easier to maintain.',
    '1 mark for each method + 1 for its explanation, max 4:\n• Comments…\n• …explain what each part of the code does, so other programmers can understand it\n• Meaningful variable names…\n• …make clear what data each variable holds\n• Indentation…\n• …shows which code is inside loops/selection\n• Sub programs…\n• …code can be reused and tested/updated separately');
  Q('6', 'a', 4, 'K', 'Describe two differences between a compiler and an interpreter.',
    '1 mark for each point, max 2 per difference:\n• A compiler translates the whole program at once…\n• …an interpreter translates and runs one line at a time\n• A compiler produces an executable file that can be run again without translating…\n• …an interpreter translates the program every time it runs\n• A compiler reports errors after translating the whole program…\n• …an interpreter stops at the first error');
  Q('6', 'b', 4, 'K', 'Describe two tools in an Integrated Development Environment (IDE) that help a programmer find and fix errors.',
    '1 mark for each tool + 1 for its description, max 4:\n• Error messages / error diagnostics…\n• …show the type of error and the line number\n• Breakpoints…\n• …stop the program at a chosen line so values can be checked\n• Stepping…\n• …runs the code one line at a time\n• Variable watch…\n• …shows the values of variables as the program runs\n• Syntax highlighting…\n• …shows keywords in colour so misspellings stand out');
  Q('7', 'a', 4, 'H', 'The canteen stores data about each meal. State the most suitable data type for each field: MealName (eg "Pasta bake"), Price (eg 2.35), Calories (eg 540), Vegetarian (eg True).',
    '1 mark each:\n• MealName: string\n• Price: real / float\n• Calories: integer\n• Vegetarian: Boolean');
  Q('7', 'b', 3, 'H', 'The table Meals has the fields MealName, Price, Calories and Vegetarian. Write an SQL statement to display the MealName and Price of every vegetarian meal.',
    '1 mark each:\n• SELECT MealName, Price\n• FROM Meals\n• WHERE Vegetarian = True\nGuidance: Accept WHERE Vegetarian = "True" / 1 / "Yes". Do not accept SELECT * for the first mark.');
  Q('7', 'c', 2, 'H', 'State the result of 17 MOD 3 and 17 DIV 3.',
    '1 mark each:\n• 17 MOD 3 = 2\n• 17 DIV 3 = 5');

  // ---------------- SECTION B (30 marks) ----------------
  const club = p('Fernhill School runs a running club. A program records each runner’s lap times in seconds.');
  const runners = code(['array runners = ["Asha", "Ben", "Cara", "Dev", "Ella"]']);
  Q('8', 'a.i', 1, 'H', 'The names of the runners are stored in an array. State the value of runners[3].',
    '• "Dev"\nGuidance: Ignore quotation marks.', { sec: 'B', ctx: [club, runners] });
  Q('8', 'a.ii', 3, 'H', 'Write an algorithm that uses a loop to output the name of every runner in the array runners. You must use either OCR Exam Reference Language or a high-level programming language that you have studied.',
    '1 mark each:\n• Uses a loop with the correct number of iterations (0 to 4 // for each item)\n• Accesses runners[i] using the loop variable\n• Outputs each name inside the loop\nExample:\nfor i = 0 to 4\n    print(runners[i])\nnext i\nPython: for name in runners: print(name)', { sec: 'B', ctx: [club, runners] });
  Q('8', 'b', 5, 'H', 'Write a function called avgTime that takes an array of five lap times as a parameter and returns the average lap time. You must use either OCR Exam Reference Language or a high-level programming language that you have studied.',
    '1 mark each:\n• Function defined with the name avgTime and one parameter\n• Total initialised to 0 (or a suitable sum function used)\n• Loop that adds each of the five times to the total\n• Divides the total by 5 (or by the array length)\n• Returns the average (not just printed)\nExample:\nfunction avgTime(times)\n    total = 0\n    for i = 0 to 4\n        total = total + times[i]\n    next i\n    return total / 5\nendfunction', { sec: 'B', ctx: [club] });
  Q('8', 'c', 5, 'I', 'A lap time is valid if it is between 30.0 and 300.0 seconds inclusive. Write an algorithm that asks the user to enter a lap time and keeps asking until a valid time is entered, then outputs "Saved". You must use either OCR Exam Reference Language or a high-level programming language that you have studied.',
    '1 mark each:\n• Takes a lap time as input and casts it to a real/float\n• Uses a condition-controlled loop\n• Correct condition: time < 30.0 OR time > 300.0 (or equivalent)\n• Asks for the time again inside the loop (and/or outputs an error message)\n• Outputs "Saved" after the loop, only once a valid time has been entered\nExample:\nlap = float(input("Enter lap time"))\nwhile lap < 30.0 OR lap > 300.0\n    print("Invalid time")\n    lap = float(input("Enter lap time"))\nendwhile\nprint("Saved")', { sec: 'B', ctx: [club] });
  Q('8', 'd', 4, 'G', 'This algorithm should output the fastest (smallest) of the five lap times stored in the array times. It contains two logic errors. Identify the line number of each logic error and write the corrected line.',
    '1 mark for each line number, 1 mark for each correction:\n• Line 01\n• fastest = times[0]\n• Line 03\n• if times[i] < fastest then', { sec: 'B', ctx: [club, code(['fastest = times[1]', 'for i = 1 to 4', '    if times[i] > fastest then', '        fastest = times[i]', '    endif', 'next i', 'print("Fastest: " + str(fastest))'])] });
  Q('8', 'e', 2, 'H', 'State the output of this algorithm.',
    '1 mark for each correct part:\n• JONES\n• …C (output exactly JONESC)', { sec: 'B', ctx: [club, code(['name = "Cara Jones"', 'initial = name.left(1)', 'surname = name.right(5)', 'print(surname.upper + initial)'])] });
  Q('8', 'f', 4, 'H', 'The lap times for each runner over three laps are stored in a 2D array called results. results[2, 0] is Cara’s first lap time. Write an algorithm to output the total of Cara’s three lap times. You must use either OCR Exam Reference Language or a high-level programming language that you have studied.',
    '1 mark each:\n• Total initialised to 0\n• Loop over the three laps (0 to 2) // three values added\n• Adds results[2, lap] each time (correct row fixed at 2)\n• Outputs the total after the loop\nExample:\ntotal = 0\nfor lap = 0 to 2\n    total = total + results[2, lap]\nnext lap\nprint(total)', { sec: 'B', ctx: [club, p('results[runner, lap] — runner 0 to 4 (in the same order as the array runners), lap 0 to 2.')] });
  Q('8', 'g', 3, 'H', 'Write an algorithm to save all five runners’ names to a new text file called runners.txt, one name per line. You must use either OCR Exam Reference Language or a high-level programming language that you have studied.',
    '1 mark each:\n• Creates/opens the file runners.txt for writing\n• Writes each name (in a loop) // writeLine(runners[i])\n• Closes the file\nExample:\nnewFile("runners.txt")\nmyFile = open("runners.txt")\nfor i = 0 to 4\n    myFile.writeLine(runners[i])\nnext i\nmyFile.close()', { sec: 'B', ctx: [club, runners] });
  Q('8', 'h', 3, 'H', 'The program uses sub programs such as avgTime. Give three benefits of using sub programs.',
    '1 mark each to max 3:\n• Code can be reused / called many times without rewriting it\n• Makes the program shorter / easier to read\n• Each sub program can be tested separately\n• Easier to maintain / update in one place\n• Different programmers can work on different sub programs\n• Can be saved in a library and used in other programs', { sec: 'B', ctx: [club] });
