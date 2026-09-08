# Generates real .accdb sample databases for the RA10 Unit 4 assignment briefs.
# Uses the Microsoft ACE OLEDB engine (ADOX + ADODB) — requires Access/ACE runtime.
# Outputs to revision/btec/level-3/IT-AAQ/unit-4/samples/

$ErrorActionPreference = 'Stop'
$base = Join-Path $PSScriptRoot '..\revision\btec\level-3\IT-AAQ\unit-4\samples'
if (-not (Test-Path $base)) { New-Item -ItemType Directory -Force -Path $base | Out-Null }

# ADOX data type constants
$adVarWChar   = 202   # Short Text
$adLongVarWChar = 203 # Long Text (Memo)
$adInteger    = 3     # Long Integer
$adDouble     = 5     # Double
$adCurrency   = 6     # Currency
$adDate       = 7     # Date/Time
$adBoolean    = 11    # Yes/No

function New-AccdbFile {
    param([string]$Path)
    if (Test-Path $Path) { Remove-Item $Path -Force }
    $cat = New-Object -ComObject ADOX.Catalog
    $cat.Create("Provider=Microsoft.ACE.OLEDB.16.0;Data Source=$Path")
    $cat = $null
}

function Add-Table {
    param($Catalog, [string]$Name)
    $tbl = New-Object -ComObject ADOX.Table
    $tbl.Name = $Name
    $tbl
}

function Add-Column {
    param($Table, [string]$Name, [int]$Type, [int]$Size)
    if ($Size) { [void]$Table.Columns.Append($Name, $Type, $Size) }
    else { [void]$Table.Columns.Append($Name, $Type) }
}

function Add-Pk {
    param($Table, [string]$PkName, [string]$Column)
    [void]$Table.Keys.Append($PkName, 1, $Column)  # adKeyPrimary = 1
}

# ── Schema definitions ──────────────────────────────────────────
# Each scenario: name, filename, list of tables.
# Table = @{ name=; cols=@( @(name,type,size) ); pk=@(col); fks=@( @(name,col,relTable,relCol) ); rows=@( @{...} ) }

$scenarios = @()

# 1. College Course Enrolment
$scenarios += @{
  id = 'college-enrolment'
  file = 'CollegeCourseEnrolment.accdb'
  title = 'College Course Enrolment'
  tables = @(
    @{ name='Learner'; cols=@( @('LearnerID','S',8), @('LearnerForename','S',30), @('LearnerSurname','S',30), @('LearnerAddress1','S',50), @('LearnerTown','S',30), @('LearnerEmail','S',50) );
       pk=@('LearnerID'); fks=@();
       rows=@(
         @{ LearnerID='L001'; LearnerForename='Aaliyah'; LearnerSurname='Bennett'; LearnerAddress1='12 Mill Lane'; LearnerTown='Newgate'; LearnerEmail='a.bennett@mail.com' },
         @{ LearnerID='L002'; LearnerForename='Aaron'; LearnerSurname='Sharp'; LearnerAddress1='4 Fallow Close'; LearnerTown='Fallowend'; LearnerEmail='a.sharp@mail.com' },
         @{ LearnerID='L003'; LearnerForename='Amelia'; LearnerSurname='Foster'; LearnerAddress1='88 Hazel Road'; LearnerTown='Hazelthorpe'; LearnerEmail='a.foster@mail.com' },
         @{ LearnerID='L004'; LearnerForename='Caleb'; LearnerSurname='Morton'; LearnerAddress1='3 Rowbury Way'; LearnerTown='Rowbury'; LearnerEmail='c.morton@mail.com' },
         @{ LearnerID='L005'; LearnerForename='Chloe'; LearnerSurname='Brooks'; LearnerAddress1='19 Larch Drive'; LearnerTown='Larchfield'; LearnerEmail='c.brooks@mail.com' }
       ) },
    @{ name='Subject'; cols=@( @('SubjectID','S',10), @('Subject','S',60) ); pk=@('SubjectID'); fks=@();
       rows=@(
         @{ SubjectID='SUB-001'; Subject='A-Level Chemistry' },
         @{ SubjectID='SUB-002'; Subject='A-Level History' },
         @{ SubjectID='SUB-003'; Subject='Apprenticeship Digital Marketing' }
       ) },
    @{ name='Staff'; cols=@( @('StaffID','S',6), @('StaffForename','S',30), @('StaffSurname','S',30), @('StaffEmail','S',50) ); pk=@('StaffID'); fks=@();
       rows=@(
         @{ StaffID='S002'; StaffForename='James'; StaffSurname='Yates'; StaffEmail='j.yates@college.ac.uk' },
         @{ StaffID='S003'; StaffForename='Rachel'; StaffSurname='Lewis'; StaffEmail='r.lewis@college.ac.uk' },
         @{ StaffID='S004'; StaffForename='David'; StaffSurname='Green'; StaffEmail='d.green@college.ac.uk' }
       ) },
    @{ name='Course'; cols=@( @('CourseID','S',12), @('SubjectID','S',10), @('CourseStartDate','D',0), @('CourseEndDate','D',0), @('CourseCost','C',0) ); pk=@('CourseID'); fks=@( ,@('FK_Course_Subject','SubjectID','Subject','SubjectID') );
       rows=@(
         @{ CourseID='COU-001'; SubjectID='SUB-001'; CourseStartDate='2022-09-05'; CourseEndDate='2024-06-20'; CourseCost=0 },
         @{ CourseID='COU-002'; SubjectID='SUB-002'; CourseStartDate='2022-09-05'; CourseEndDate='2024-06-20'; CourseCost=0 },
         @{ CourseID='COU-003'; SubjectID='SUB-003'; CourseStartDate='2022-09-05'; CourseEndDate='2023-07-28'; CourseCost=1500 }
       ) },
    @{ name='Enrolment'; cols=@( @('EnrolmentID','S',14), @('LearnerID','S',8), @('CourseID','S',12), @('StaffID','S',6), @('TargetGrade','S',10), @('ActualGrade','S',10), @('CourseCost','C',0), @('LearnerCompletedCourse','B',0), @('LearnerWithdrawnCompletely','B',0) ); pk=@('EnrolmentID'); fks=@( @('FK_Enrolment_Learner','LearnerID','Learner','LearnerID'), @('FK_Enrolment_Course','CourseID','Course','CourseID'), @('FK_Enrolment_Staff','StaffID','Staff','StaffID') );
       rows=@(
         @{ EnrolmentID='ENR-000001'; LearnerID='L001'; CourseID='COU-001'; StaffID='S003'; TargetGrade='A'; ActualGrade=''; CourseCost=0; LearnerCompletedCourse=$false; LearnerWithdrawnCompletely=$false },
         @{ EnrolmentID='ENR-000002'; LearnerID='L002'; CourseID='COU-001'; StaffID='S003'; TargetGrade='A*'; ActualGrade='A'; CourseCost=0; LearnerCompletedCourse=$true; LearnerWithdrawnCompletely=$false },
         @{ EnrolmentID='ENR-000003'; LearnerID='L004'; CourseID='COU-001'; StaffID='S003'; TargetGrade='B'; ActualGrade='B'; CourseCost=0; LearnerCompletedCourse=$true; LearnerWithdrawnCompletely=$false },
         @{ EnrolmentID='ENR-000015'; LearnerID='L001'; CourseID='COU-002'; StaffID='S004'; TargetGrade='B'; ActualGrade=''; CourseCost=0; LearnerCompletedCourse=$false; LearnerWithdrawnCompletely=$false },
         @{ EnrolmentID='ENR-000018'; LearnerID='L005'; CourseID='COU-002'; StaffID='S004'; TargetGrade='B'; ActualGrade='B'; CourseCost=0; LearnerCompletedCourse=$true; LearnerWithdrawnCompletely=$false },
         @{ EnrolmentID='ENR-000034'; LearnerID='L003'; CourseID='COU-003'; StaffID='S002'; TargetGrade='Merit'; ActualGrade='Merit'; CourseCost=1500; LearnerCompletedCourse=$true; LearnerWithdrawnCompletely=$false }
       ) }
  )
}

# 2. Retro Cinema Booking System
$scenarios += @{
  id = 'cinema-bookings'
  file = 'RetroCinemaBooking.accdb'
  title = 'Retro Cinema Booking System'
  tables = @(
    @{ name='Film'; cols=@( @('FilmID','S',8), @('Title','S',60), @('Genre','S',30), @('Rating','S',5) ); pk=@('FilmID'); fks=@();
       rows=@(
         @{ FilmID='F001'; Title='Casablanca'; Genre='Drama'; Rating='U' },
         @{ FilmID='F002'; Title='The Third Man'; Genre='Thriller'; Rating='PG' },
         @{ FilmID='F003'; Title='Psycho'; Genre='Horror'; Rating='15' },
         @{ FilmID='F004'; Title='Singin in the Rain'; Genre='Musical'; Rating='U' }
       ) },
    @{ name='Screen'; cols=@( @('ScreenID','S',6), @('ScreenName','S',30), @('Seats','I',0) ); pk=@('ScreenID'); fks=@();
       rows=@(
         @{ ScreenID='SCR-1'; ScreenName='Screen One'; Seats=80 },
         @{ ScreenID='SCR-2'; ScreenName='Screen Two'; Seats=60 },
         @{ ScreenID='SCR-3'; ScreenName='Screen Three'; Seats=40 }
       ) },
    @{ name='Customer'; cols=@( @('CustomerID','S',8), @('Forename','S',30), @('Surname','S',30), @('Phone','S',20) ); pk=@('CustomerID'); fks=@();
       rows=@(
         @{ CustomerID='C001'; Forename='Mia'; Surname='Turner'; Phone='07700 900001' },
         @{ CustomerID='C002'; Forename='Oscar'; Surname='Patel'; Phone='07700 900002' },
         @{ CustomerID='C003'; Forename='Grace'; Surname='Okoye'; Phone='07700 900003' }
       ) },
    @{ name='Screening'; cols=@( @('ScreeningID','S',10), @('FilmID','S',8), @('ScreenID','S',6), @('ScreeningDate','D',0), @('StartTime','S',5) ); pk=@('ScreeningID'); fks=@( @('FK_Scr_Film','FilmID','Film','FilmID'), @('FK_Scr_Screen','ScreenID','Screen','ScreenID') );
       rows=@(
         @{ ScreeningID='SCRN-001'; FilmID='F001'; ScreenID='SCR-1'; ScreeningDate='2026-03-14'; StartTime='19:30' },
         @{ ScreeningID='SCRN-002'; FilmID='F002'; ScreenID='SCR-2'; ScreeningDate='2026-03-14'; StartTime='20:00' },
         @{ ScreeningID='SCRN-003'; FilmID='F003'; ScreenID='SCR-3'; ScreeningDate='2026-03-15'; StartTime='21:00' }
       ) },
    @{ name='Booking'; cols=@( @('BookingID','S',10), @('ScreeningID','S',10), @('CustomerID','S',8), @('SeatsBooked','I',0), @('BookingDate','D',0) ); pk=@('BookingID'); fks=@( @('FK_Book_Scr','ScreeningID','Screening','ScreeningID'), @('FK_Book_Cust','CustomerID','Customer','CustomerID') );
       rows=@(
         @{ BookingID='BK-0001'; ScreeningID='SCRN-001'; CustomerID='C001'; SeatsBooked=2; BookingDate='2026-03-10' },
         @{ BookingID='BK-0002'; ScreeningID='SCRN-001'; CustomerID='C002'; SeatsBooked=1; BookingDate='2026-03-11' },
         @{ BookingID='BK-0003'; ScreeningID='SCRN-002'; CustomerID='C003'; SeatsBooked=4; BookingDate='2026-03-12' }
       ) }
  )
}

# 3. Garage Repairs & MOT Booking
$scenarios += @{
  id = 'garage-repairs'
  file = 'GarageRepairs.accdb'
  title = 'Garage Repairs & MOT Booking'
  tables = @(
    @{ name='Customer'; cols=@( @('CustomerID','S',8), @('Forename','S',30), @('Surname','S',30), @('Phone','S',20), @('Email','S',50) ); pk=@('CustomerID'); fks=@();
       rows=@(
         @{ CustomerID='CU001'; Forename='Daniel'; Surname='Wright'; Phone='07800 111222'; Email='d.wright@mail.com' },
         @{ CustomerID='CU002'; Forename='Sophie'; Surname='Ali'; Phone='07800 111333'; Email='s.ali@mail.com' },
         @{ CustomerID='CU003'; Forename='Jack'; Surname='Hughes'; Phone='07800 111444'; Email='j.hughes@mail.com' }
       ) },
    @{ name='Mechanic'; cols=@( @('MechanicID','S',6), @('Forename','S',30), @('Surname','S',30), @('HourlyRate','C',0) ); pk=@('MechanicID'); fks=@();
       rows=@(
         @{ MechanicID='M001'; Forename='Tom'; Surname='Reed'; HourlyRate=45 },
         @{ MechanicID='M002'; Forename='Aisha'; Surname='Khan'; HourlyRate=50 }
       ) },
    @{ name='Vehicle'; cols=@( @('VehicleID','S',8), @('CustomerID','S',8), @('Make','S',30), @('Model','S',30), @('Registration','S',10), @('Year','I',0) ); pk=@('VehicleID'); fks=@( ,@('FK_Veh_Cust','CustomerID','Customer','CustomerID') );
       rows=@(
         @{ VehicleID='V001'; CustomerID='CU001'; Make='Ford'; Model='Fiesta'; Registration='AB12 CDE'; Year=2018 },
         @{ VehicleID='V002'; CustomerID='CU002'; Make='Vauxhall'; Model='Corsa'; Registration='EF34 GHI'; Year=2020 },
         @{ VehicleID='V003'; CustomerID='CU003'; Make='VW'; Model='Golf'; Registration='JK56 LMN'; Year=2016 }
       ) },
    @{ name='Part'; cols=@( @('PartID','S',8), @('PartName','S',50), @('Cost','C',0) ); pk=@('PartID'); fks=@();
       rows=@(
         @{ PartID='P001'; PartName='Oil filter'; Cost=8.5 },
         @{ PartID='P002'; PartName='Brake pads (front)'; Cost=42 },
         @{ PartID='P003'; PartName='Spark plugs (set)'; Cost=28 }
       ) },
    @{ name='Job'; cols=@( @('JobID','S',8), @('VehicleID','S',8), @('MechanicID','S',6), @('JobDescription','S',120), @('DateBooked','D',0), @('DateCompleted','D',0), @('LabourCost','C',0) ); pk=@('JobID'); fks=@( @('FK_Job_Veh','VehicleID','Vehicle','VehicleID'), @('FK_Job_Mech','MechanicID','Mechanic','MechanicID') );
       rows=@(
         @{ JobID='JOB-001'; VehicleID='V001'; MechanicID='M001'; JobDescription='Full service'; DateBooked='2026-03-02'; DateCompleted='2026-03-02'; LabourCost=90 },
         @{ JobID='JOB-002'; VehicleID='V002'; MechanicID='M002'; JobDescription='MOT and brake pads'; DateBooked='2026-03-05'; DateCompleted=$null; LabourCost=0 },
         @{ JobID='JOB-003'; VehicleID='V003'; MechanicID='M001'; JobDescription='Spark plug replacement'; DateBooked='2026-03-06'; DateCompleted='2026-03-06'; LabourCost=45 }
       ) },
    @{ name='JobPart'; cols=@( @('JobID','S',8), @('PartID','S',8), @('Quantity','I',0) ); pk=@('JobID','PartID'); fks=@( @('FK_JP_Job','JobID','Job','JobID'), @('FK_JP_Part','PartID','Part','PartID') );
       rows=@(
         @{ JobID='JOB-001'; PartID='P001'; Quantity=1 },
         @{ JobID='JOB-002'; PartID='P002'; Quantity=1 },
         @{ JobID='JOB-003'; PartID='P003'; Quantity=1 }
       ) }
  )
}

# 4. School Library Loans
$scenarios += @{
  id = 'library-loans'
  file = 'SchoolLibraryLoans.accdb'
  title = 'School Library Loans'
  tables = @(
    @{ name='Student'; cols=@( @('StudentID','S',8), @('StudentName','S',60), @('TutorGroup','S',10) ); pk=@('StudentID'); fks=@();
       rows=@(
         @{ StudentID='ST001'; StudentName='Priya Sharma'; TutorGroup='10A' },
         @{ StudentID='ST002'; StudentName='Leo Jones'; TutorGroup='10B' },
         @{ StudentID='ST003'; StudentName='Nina Patel'; TutorGroup='11A' }
       ) },
    @{ name='Book'; cols=@( @('BookID','S',8), @('Title','S',80), @('Author','S',60), @('ISBN','S',20) ); pk=@('BookID'); fks=@();
       rows=@(
         @{ BookID='BK001'; Title='Of Mice and Men'; Author='John Steinbeck'; ISBN='9780141185101' },
         @{ BookID='BK002'; Title='Frankenstein'; Author='Mary Shelley'; ISBN='9780141439471' },
         @{ BookID='BK003'; Title='The Great Gatsby'; Author='F. Scott Fitzgerald'; ISBN='9780141182636' }
       ) },
    @{ name='Loan'; cols=@( @('LoanID','S',8), @('StudentID','S',8), @('BookID','S',8), @('LoanedDate','D',0), @('DueDate','D',0), @('ReturnedDate','D',0) ); pk=@('LoanID'); fks=@( @('FK_Loan_Stu','StudentID','Student','StudentID'), @('FK_Loan_Book','BookID','Book','BookID') );
       rows=@(
         @{ LoanID='LO001'; StudentID='ST001'; BookID='BK001'; LoanedDate='2026-03-01'; DueDate='2026-03-15'; ReturnedDate=$null },
         @{ LoanID='LO002'; StudentID='ST002'; BookID='BK002'; LoanedDate='2026-03-02'; DueDate='2026-03-16'; ReturnedDate=$null },
         @{ LoanID='LO003'; StudentID='ST003'; BookID='BK003'; LoanedDate='2026-02-20'; DueDate='2026-03-06'; ReturnedDate='2026-03-05' }
       ) }
  )
}

# 5. Holiday Booking Agency
$scenarios += @{
  id = 'travel-agency'
  file = 'HolidayBookingAgency.accdb'
  title = 'Holiday Booking Agency'
  tables = @(
    @{ name='Customer'; cols=@( @('CustomerID','S',8), @('Forename','S',30), @('Surname','S',30), @('Email','S',50), @('Phone','S',20) ); pk=@('CustomerID'); fks=@();
       rows=@(
         @{ CustomerID='C0001'; Forename='Ella'; Surname='Morgan'; Email='e.morgan@mail.com'; Phone='07900 200001' },
         @{ CustomerID='C0002'; Forename='Harry'; Surname='Clarke'; Email='h.clarke@mail.com'; Phone='07900 200002' },
         @{ CustomerID='C0003'; Forename='Zara'; Surname='Begum'; Email='z.begum@mail.com'; Phone='07900 200003' }
       ) },
    @{ name='Hotel'; cols=@( @('HotelID','S',8), @('HotelName','S',60), @('Destination','S',40), @('StarRating','I',0) ); pk=@('HotelID'); fks=@();
       rows=@(
         @{ HotelID='H001'; HotelName='Villa Azure'; Destination='Corfu'; StarRating=4 },
         @{ HotelID='H002'; HotelName='Hotel Sol'; Destination='Costa del Sol'; StarRating=3 },
         @{ HotelID='H003'; HotelName='Grand Plaza'; Destination='Rome'; StarRating=5 }
       ) },
    @{ name='Holiday'; cols=@( @('HolidayID','S',8), @('HotelID','S',8), @('HolidayName','S',60), @('Price','C',0), @('DurationNights','I',0) ); pk=@('HolidayID'); fks=@( ,@('FK_Hol_Hotel','HotelID','Hotel','HotelID') );
       rows=@(
         @{ HolidayID='HL001'; HotelID='H001'; HolidayName='Corfu Escape'; Price=649; DurationNights=7 },
         @{ HolidayID='HL002'; HotelID='H002'; HolidayName='Costa Sun'; Price=429; DurationNights=7 },
         @{ HolidayID='HL003'; HotelID='H003'; HolidayName='Rome City Break'; Price=799; DurationNights=4 }
       ) },
    @{ name='Booking'; cols=@( @('BookingID','S',10), @('CustomerID','S',8), @('HolidayID','S',8), @('BookingDate','D',0), @('Passengers','I',0), @('TotalCost','C',0) ); pk=@('BookingID'); fks=@( @('FK_Book_Cust','CustomerID','Customer','CustomerID'), @('FK_Book_Hol','HolidayID','Holiday','HolidayID') );
       rows=@(
         @{ BookingID='BKG-0001'; CustomerID='C0001'; HolidayID='HL001'; BookingDate='2026-03-03'; Passengers=2; TotalCost=1298 },
         @{ BookingID='BKG-0002'; CustomerID='C0002'; HolidayID='HL002'; BookingDate='2026-03-04'; Passengers=4; TotalCost=1716 },
         @{ BookingID='BKG-0003'; CustomerID='C0003'; HolidayID='HL003'; BookingDate='2026-03-05'; Passengers=2; TotalCost=1598 }
       ) }
  )
}

# ── Generate ────────────────────────────────────────────────────
function Get-SqlType {
    param([string]$t, [int]$size)
    switch ($t) {
        'S' { return "VARCHAR($size)" }
        'L' { return "MEMO" }
        'I' { return "INTEGER" }
        'N' { return "DOUBLE" }
        'C' { return "CURRENCY" }
        'D' { return "DATETIME" }
        'B' { return "YESNO" }
        default { return "VARCHAR(255)" }
    }
}

foreach ($sc in $scenarios) {
    $path = Join-Path $base $sc.file
    Write-Host "Building $($sc.file) ..."
    New-AccdbFile -Path $path

    $cn = New-Object -ComObject ADODB.Connection
    $cn.Open("Provider=Microsoft.ACE.OLEDB.16.0;Data Source=$path")

    # Create tables (DDL)
    foreach ($t in $sc.tables) {
        $colDefs = @()
        foreach ($c in $t.cols) {
            $colDefs += "[$($c[0])] $(Get-SqlType -t $c[1] -size $c[2])"
        }
        $pkList = ($t.pk | ForEach-Object { "[$_]" }) -join ', '
        $colDefs += "CONSTRAINT [PK_$($t.name)] PRIMARY KEY ($pkList)"
        $create = "CREATE TABLE [$($t.name)] ($($colDefs -join ', '))"
        [void]$cn.Execute($create)
    }

    # Insert data
    foreach ($t in $sc.tables) {
        foreach ($row in $t.rows) {
            $cols = @(); $vals = @()
            foreach ($prop in $row.GetEnumerator()) {
                $cols += $prop.Key
                $v = $prop.Value
                if ($v -is [bool]) { $v = if ($v) { -1 } else { 0 } }
                if ($v -is [string]) { $v = $v -replace "'", "''" }
                $vals += $v
            }
            $colList = ($cols | ForEach-Object { "[$_]" }) -join ', '
            $valList = ($vals | ForEach-Object {
                if ($_ -eq $null) { 'NULL' }
                elseif ($_ -is [int] -or $_ -is [double] -or $_ -is [decimal]) { "$_" }
                else { "'$_'" }
            }) -join ', '
            [void]$cn.Execute("INSERT INTO [$($t.name)] ($colList) VALUES ($valList)")
        }
    }

    # Add foreign keys (DDL) — after data so referenced rows exist
    foreach ($t in $sc.tables) {
        foreach ($fk in $t.fks) {
            $sql = "ALTER TABLE [$($t.name)] ADD CONSTRAINT [$($fk[0])] FOREIGN KEY ([$($fk[1])]) REFERENCES [$($fk[2])] ([$($fk[3])])"
            try { [void]$cn.Execute($sql) }
            catch { Write-Host "  FK FAILED: $sql -> $($_.Exception.Message)" }
        }
    }

    $cn.Close()
    $cn = $null
    Write-Host "  -> $path ($((Get-Item $path).Length) bytes)"
}

Write-Host "`nDone. Generated $($scenarios.Count) .accdb files."
