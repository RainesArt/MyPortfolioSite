/* Arthur Raines
 * This file contains cleaning code I've implemented in some of my projects
 * Created 7/15/2025
*/

version 19
clear all
set more off

/* Following local macros set the directory for each data file, the datafile name,
and the directory to save the cleaned data file */

local data_dir ""
local data_file ""
local save_dir ""

/* Instead of having to write variables again and again to deal with dropping duplicates
this local macro contains the variables that I want to check for duplicates. In one of my
cleaning files, I excluded a system generated variable that made observations which were
clear duplicates appear as if they were not*/

local variables_to_use

import excel "`data_dir'`data_file'", sheet("child_data") firstrow

replace Gender = "Female" if Gender == "F"
replace Gender = "Male" if Gender == "M"

tostring EnglishLangPrim, replace
tostring IsHispanic, replace
tostring HasIEP, replace
tostring HasIFSP, replace 


local variables_strings_only ""

/* I want to remove white space and turn values to lower case to standardize */
foreach var of varlist `variables_strings_only'{
	replace `var' = trim(`var')
	replac `var' = lower(`var')
}

duplicates report ID `variables_to_use'
duplicates drop ID `variables_to_use', force

/* In some instances, I observed the same child record twice. However, the values
for things like gender were different. The difference in values between observations
could've occured for a plethora of reasons. Therefore, I did not want to assume that
one value was the "correct" value. Consequently, I decided two approaches. The first
was to create a new variable that is the most frequent gender value. When there is a tie,
I randomly select a gender value. Importantly, If the tie is between a missing gender value
and non missing gender value, I select the nonmissing value */

bysort ID: egen model_gender_value = mode(Gender)
set seed 12345
gen random = runiform()

* (1) counts non-missing gender values, selects a random non-missing gender value for each ChildPlusID, and assigns it to random_gender
* Count non-missing gender values per individual
bysort ID: gen nonmissing = sum(!missing(Gender))
bysort ID: gen total_nonmissing = nonmissing[_N]

bysort ID: gen select_num = ceil(random[1] * total_nonmissing) if total_nonmissing > 0
bysort ID (random): gen random_gender = GenderCode if nonmissing == select_num & total_nonmissing > 0 & model_gender_value == ""
bysort ID: replace random_gender = random_gender[1] if missing(random_gender)

* (2) Encodes the random gender as a number, then converts it back to "female" or "male".	
 * 1 is female 2 is male for random gender
encode random_gender, generate(random_gender_Encoded)
bysort ChildPlusID: egen random_gender_num = max(random_gender_Encoded)
tostring random_gender_num, replace force
replace random_gender_num = "female" if random_gender_num == "1"
replace random_gender_num = "male" if random_gender_num == "2"
* end of (2)

* (3) Updates Gender_one_new with random_gender_num if the modal value was a missing value, and creates Gender_two_new for different non-missing values.
bysort ID: gen Gender_one_new = random_gender_num if model_gender_value == "" // replace the ties with a non-missing gender value 
gen Gender_two_new = Gender if Gender != model_gender_value & Gender != Gender_one_new & Gender != ""

encode Gender_two_new, generate(Gender_two_new_Encoded)
bysort ID: egen Gender_two_new_num = max(Gender_two_new_Encoded)
tostring Gender_two_new_num, replace force
replace Gender_two_new = "female" if Gender_two_new_num == "1"
replace Gender_two_new = "male" if Gender_two_new_num == "2"

replace model_gender_value = random_gender_num if model_gender_value == ""


/* In the following pieces of code, I sometimes may not want to select a value.
so, instead, I can store all the potential values of a particular observation into
seperate variables. i.e., gender_1, gender_2, gender_3, gender_4. */

gen gender_1 = ""
gen gender_2 = ""
gen gender_3 = ""
gen gender_4 = ""
gen gender_5 = ""

 // This code is really not efficient for a large number of observations
	/* For a large number of observations, the approach is to only do the code
	   below on those obseravtions where we observe changes by utilzing Stata's
	   Max and Min commands */
	   
levels of ID, local(IDs)
foreach c of local IDs {
	* Get all unique genders for the current childID
	levelsof Gender if ID == `c', local(genders)
	
	* Initialize an index variable
	local i = 1
	
	* Loop over each gender and replace the gender variables
	foreach g of local genders {
		replace gender_`i' = "`g'" if ID == `c'
		local ++i
	}
	
	* If there are fewer genders than the number of gender variables, set the remaining variables to missing
	forvalues j = `i'/5 {
		replace gender_`j' = "" if ID == `c'
	}
}

drop gender_3 gender_4 gender_5 // depening on how many values might exist can drop other gender_ variables
drop nonmissing
drop total_nonmissing
drop select_num


/* Sometimes, you might observe that a child has more than one race. The code above might not work
So, here is a similar approach for saving all the observed races of a child, person or entity */

sort ID RaceDescript
levelsof RaceDescript, local(races)

foreach r in `races' {
	local shortname = substr(`r', 1, 15) // the length may vary 15 was suitable for me
	local shortname = strtoname("`shortname'")
	bysort ID: gen `shortname' = (RaceDescript == "`r'")
}

bysort ID: egen any_asian = max(asian)
bysort ID: egen any_white = max(white)
bysort ID: egen any_black = max(black_or_africa)
bysort ID: egen any_nam = max(american_indian)
bysort ID: egen any_nah = max(native_hawaiian)
bysort ID: egen any_multi = max(multi_racial_bi)
bysort ID: egen any_other = max(other)
bysort ID: egen any_unspecified = max(unspecified)
foreach r in `races' {
	local shortname = substr("`r'", 1, 15)
	local shortname = strtoname("`shortname'")
	if "`shortname'" == "asian" {
		replace `shortname' = any_asian
	}
	else if "`shortname'" == "white" {
		replace `shortname' = any_white
	}
	else if "`shortname'" == "black_or_africa" {
		replace `shortname' = any_black
	}
	else if "`shortname'" == "american_indian" {
		replace `shortname' = any_nam
	}
	else if "`shortname'" == "native_hawaiian" {
		replace `shortname' = any_nah
	}
	else if "`shortname'" == "multi_racial_bi" {
		replace `shortname' = any_multi
	}
	else if "`shortname'" == "other" {
		replace `shortname' = any_other
	}
	else if "`shortname'" == "unspecified" {
		replace `shortname' = any_unspecified
	}
}	
drop any_*

**# Column values in the wrong place #
/* Data inside the SQL DBs sometimes were put in without validation that the
raw excel or csv file had all the columns in the right palce. Additionally, the DBs
I worked on developed by others did not check for this. As a consequence, data with
columns values in the wrong place ended up the DB. The code below is just one way
I fixed that */


// set trace on
foreach var of varlist `variables_shifting'{
	display `var'
	mata: tokens = tokens(st_local("variables_shifting"))  
	if `i' == 0 {
		display "Continuing..." // ignore the first column name since the column before it is not shifted incorrectly 
	}
	else if `i' < 33{ // iterates up to the length of the variables_shifting local macro
		local prev_var = "`select'" // a local macro created in mata to select a particular "index" which contains a column name
		display "`prev_var'"
		qui gen n_`var' = ""
		qui replace n_`var' = `prev_var' if load_dt_ecReach >= mdy(10,1,2023) & load_dt_ecReach <= mdy(12,31,2023) // replace the new column value with the previous columns value to move everything rightward. 
		display "Replaced `var' with `prev_var'"
	}
	
	local i = `i' + 1
	mata: st_local("select", invtokens(tokens[(`i') /*+ 1) - 1*/])) // updates the column name used
	
}

foreach var of varlist `variables_shifting' {
	if "`var'" == "Birthday"{
		replace `var' = "" if load_dt_ecReach >= mdy(10,1,2023) & load_dt_ecReach <= mdy(12,31,2023) // removes old incorrect values
		display "Ignoring birthday"
	}
	else{
		replace `var' = "" if load_dt_ecReach >= mdy(10,1,2023) & load_dt_ecReach <= mdy(12,31,2023) 
		replace `var' = n_`var' if n_`var' != "" // changes column values to new swapped values for records with load_dts between october-december 2023
	}
}

foreach var of varlist `variables_no_loaddt' {
	replace `var' = trim(`var')
 	replace `var' = lower(`var')
}

exit