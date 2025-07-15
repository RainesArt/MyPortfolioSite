/*
Arthur Raines
The following file creates a formatted codebook from a cleaned dataset
Created: 7/15/2025
*/
cap log close

/* Arthur Directory */
cd ""
set rmsg on // debugging
set trace on
set varabbrev off, perm
set docx_maxtable 10000
//necessary stata packages: distinct


// Start by writing a program to specify what information we want to see for each variable
// Seperate program for numeric, str categorical, and str variables 

// Program to produce codebook for continuous numeric variables
cap program drop codebook_cont_num

program define codebook_cont_num
		
	args var dataset_name
			
	// New page
	putdocx pagebreak
			
	// Variable heading
	putdocx paragraph
	putdocx text ("`var'"), bold font(,16)
			
	// File subheading
	putdocx paragraph
	putdocx text ("File: `dataset_name'"), font(,14)
		
	// Add overview header
	putdocx paragraph, shading(lavender)
	putdocx text ("Overview"), bold font(,12)

	local var_short = substr("`var'", 1, 20)

	// Creating overview table
	putdocx table cb_`var_short' = (6,2), border(all, nil)
		
	// Identifying variable type and labels
	local lab : var label `var'
	describe `var', varlist
	capture quietly describe `var', full
	local type : type `var'
	
	// Adding to left side
	putdocx table cb_`var_short'(1,1) = ("Type: `type'")
	putdocx table cb_`var_short'(2,1) = ("Label: `lab'")		
		
	// Generating summary statistics
	count if mi(`var')
	local n_miss = r(N)
		
	sum `var'
	local n_nonmiss = r(N)
	local mean = round(r(mean),.001)
	local min = r(min)
	local max = r(max)
	local sd = round(r(sd),.001)
	
	// Adding summary statistics to the right side
	putdocx table cb_`var_short'(1,2) = ("Valid Cases: `n_nonmiss'")
	putdocx table cb_`var_short'(2,2) = ("Invalid Cases: `n_miss'")	
	putdocx table cb_`var_short'(4,2) = ("Mean: `mean'")	
	putdocx table cb_`var_short'(5,2) = ("SD: `sd'")	
	putdocx table cb_`var_short'(6,2) = ("Range: [`min', `max' ]")	
		
	quietly levelsof `var', local(unique_vals)
	local num_unique : word count `unique_vals'
	putdocx table cb_`var_short'(3,2) = ("Unique Values: `num_unique'")
		
	// Space for additional information
	putdocx paragraph, shading(lavender)
	putdocx text ("Additional"), bold font(,12)
			

	putdocx paragraph
	putdocx text ("Variable Description"), bold
	putdocx paragraph
	putdocx text (" ")
		
	putdocx paragraph
	putdocx text ("Variable Caveats"), bold
	putdocx paragraph
	putdocx text (" ")
			
				
end

// Program to produce codebook for date variables stored with format %td
cap program drop codebook_td_date
program define codebook_td_date
		
	args var dataset_name
			
	// New page
	putdocx pagebreak
			
	// Variable heading
	putdocx paragraph
	putdocx text ("`var'"), bold font(,16)
			
	// File subheading
	putdocx paragraph
	putdocx text ("File: `dataset_name'"), font(,14)
		
	// Add overview header
	putdocx paragraph, shading(lavender)
	putdocx text ("Overview"), bold font(,12)

	local var_short = substr("`var'", 1, 20)
	
	// Creating overview table
	putdocx table cb_`var_short' = (6,2), border(all, nil)
		
	// Identifying variable type and labels
	local lab : var label `var'
	describe `var', varlist
	capture quietly describe `var', full
	local type : type `var'
	
	// Adding to left side
	putdocx table cb_`var_short'(1,1) = ("Type: `type'")
	putdocx table cb_`var_short'(2,1) = ("Label: `lab'")		
		
	// Generating summary statistics
	count if mi(`var')
	local n_miss = r(N)
		
	sum `var'
	local n_nonmiss = r(N)
	local mean : display %td_ddmonCCYY r(mean)
	local min : display %td_ddmonCCYY r(min)
	local max: display %td_ddmonCCYY r(max)
	
	// Adding summary statistics to the right side
	putdocx table cb_`var_short'(1,2) = ("Valid Cases: `n_nonmiss'")
	putdocx table cb_`var_short'(2,2) = ("Invalid Cases: `n_miss'")	
	putdocx table cb_`var_short'(4,2) = ("Mean: `mean'")	
	putdocx table cb_`var_short'(5,2) = ("Range: [`min', `max' ]")	
		
	quietly levelsof `var', local(unique_vals)
	local num_unique : word count `unique_vals'
	putdocx table cb_`var_short'(3,2) = ("Unique Values: `num_unique'")
		
	// Space for additional information
	putdocx paragraph, shading(lavender)
	putdocx text ("Additional"), bold font(,12)
			

	putdocx paragraph
	putdocx text ("Variable Description"), bold
	putdocx paragraph
	putdocx text (" ")
		
	putdocx paragraph
	putdocx text ("Variable Caveats"), bold
	putdocx paragraph
	putdocx text (" ")
			
				
end


// Program for categorical numeric variables
cap program drop codebook_cat_num
program define codebook_cat_num

    args var label_name dataset_name
    
    // New page
    putdocx pagebreak
    
    // Variable heading
    putdocx paragraph
    putdocx text ("`var'"), bold font(,16)
    
    // File subheading
    putdocx paragraph
    putdocx text ("File: `dataset_name'"), font(,14)
    
    // Add overview header
    putdocx paragraph, shading(lavender)
    putdocx text ("Overview"), bold font(,12)
	
	local var = substr("`var'", 1, 20)
    
    // Creating overview table
    putdocx table cb_`var_short' = (6,2), border(all, nil)
    
    // Identifying variable type and labels
    local lab : var label `var'
    describe `var', varlist
    capture quietly describe `var', full
    local type : type `var'
    
    // Adding to left side
    putdocx table cb_`var_short'(1,1) = ("Type: `type'")
    putdocx table cb_`var_short'(2,1) = ("Label: `lab'")    
    
    // Generating summary statistics
    count if mi(`var')
    local n_miss = r(N)
    
    sum `var'
    local n_nonmiss = r(N)
    local mean = round(r(mean),.001)
    local min = r(min)
    local max = r(max)
    local sd = round(r(sd),.001)
    
    // Adding summary statistics to the right side
    putdocx table cb_`var_short'(1,2) = ("Valid Cases: `n_nonmiss'")
    putdocx table cb_`var_short'(2,2) = ("Invalid Cases: `n_miss'")    
    putdocx table cb_`var_short'(4,2) = ("Mean: `mean'")    
    putdocx table cb_`var_short'(5,2) = ("SD: `sd'")    
    putdocx table cb_`var_short'(6,2) = ("Range: [`min', `max' ]")
    
    // Creating table with label value frequencies        
    putdocx paragraph    
    putdocx text ("Tabulation: "), bold font(,12)
    
    // Get unique values
    levelsof `var', local(vals)
    local unique_vals = wordcount("`vals'")
    
    // Creating the table
    local num_row = `unique_vals' + 1
    putdocx table tab_`var' = (`num_row', 3)
    
    putdocx table tab_`var'(1,1) = ("Value"), bold
    putdocx table tab_`var'(1,2) = ("Label"), bold
    putdocx table tab_`var'(1,3) = ("Frequency"), bold
    
	// Use tab command to capture frequencies 
	capture matrix drop tab
	tabulate `var', matcell(freq) matrow(val)

	// Loop through the matrix 
	local rows = rowsof(val)
	forval i = 1/`rows' {
		local value = val[`i',1]
		local frequency = freq[`i',1]
		
		// Get the corresponding value label
		local lbl : label `label_name' `value'

		// Add values to the table
		putdocx table tab_`var'(`=`i'+1',1) = ("`value'")
		putdocx table tab_`var'(`=`i'+1',2) = ("`lbl'")
		putdocx table tab_`var'(`=`i'+1',3) = ("`frequency'")
	}

		
    // Space for additional information
    putdocx paragraph, shading(lavender)
    putdocx text ("Additional"), bold font(,12)

    putdocx paragraph
    putdocx text ("Variable Description"), bold
    putdocx paragraph
    putdocx text (" ")
    
    putdocx paragraph
    putdocx text ("Variable Caveats"), bold
    putdocx paragraph
    putdocx text (" ")
    
end


// Program to produce codebook for categorical variables with tabulated frequencies
cap program drop codebook_cat_str
program define codebook_cat_str
		
	args var dataset_name

	// New page
	putdocx pagebreak

	// Variable heading
	putdocx paragraph
	putdocx text ("`var'"), bold font(,16)

	// File subheading
	putdocx paragraph
	putdocx text ("File: `dataset_name'"), font(,14)

	// Add overview header
	putdocx paragraph, shading(lavender)
	putdocx text ("Overview"), bold font(,12)
	
	local var_short = substr("`var'", 1, 20)

	// Creating overview table
	putdocx table cb_`var_short' = (3,2), border(all, nil)

	// Identifying variable type and labels
	local lab : var label `var'
	describe `var', varlist
	capture quietly describe `var', full
	local type : type `var'

	// Putting those on the left
	putdocx table cb_`var_short'(1,1) = ("Type: `type'")
	putdocx table cb_`var_short'(2,1) = ("Label: `lab'")		
		
	// Generating summary statistics
	count if mi(`var')
	local n_miss = r(N)
		
	count if !mi(`var')
	local n_nonmiss = r(N)
		
	// Putting summary statistics on the right
	putdocx table cb_`var_short'(1,2) = ("Valid Cases: `n_nonmiss'")
	putdocx table cb_`var_short'(2,2) = ("Invalid Cases: `n_miss'")
		
	quietly levelsof `var', local(unique_vals)
	local num_unique : word count `unique_vals'
	putdocx table cb_`var_short'(3,2) = ("Unique Values: `num_unique'")

	// Creating table with value frequencies		
	putdocx paragraph	
	putdocx text ("Tabulation: "), bold font(,12)
		
	// Setting up table based on number of levels
	levelsof `var', local(vals)
	local num_vals = r(r)
		
	local num_row = `num_vals' + 1
	putdocx table tab_`var' = (`num_row', 2)
			
	putdocx table tab_`var'(1,1) = ("Value"), bold
	putdocx table tab_`var'(1,2) = ("Frequency"), bold
		
	// Iterating through all unique values to find frequencies
	local i = 2
	foreach v in `vals' {
		count if `var' == "`v'"
		local n = r(N)
		putdocx table tab_`var'(`i',1) = ("`v'")
		putdocx table tab_`var'(`i',2) = ("`n'")
		local i = `i' + 1
	}
		
	// Space for additional information
	putdocx paragraph, shading(lavender)
	putdocx text ("Additional"), bold font(,12)

	putdocx paragraph
	putdocx text ("Variable Description"), bold
	putdocx paragraph
	putdocx text (" ")
		
	putdocx paragraph
	putdocx text ("Variable Caveats"), bold
	putdocx paragraph
	putdocx text (" ")

end
		
//Program for string variables with many unique values 
cap program drop codebook_str
program define codebook_str

	args var dataset_name

	// New page
	putdocx pagebreak

	// Variable heading
	putdocx paragraph
	putdocx text ("`var'"), bold font(,16)

	// File subheading
	putdocx paragraph
	putdocx text ("File: `dataset_name'"), font(,14)

	// Add overview header
	putdocx paragraph, shading(lavender)
	putdocx text ("Overview"), bold font(,12)
	
	local var_short = substr("`var'", 1, 20)

	// Setting up overview table
	putdocx table cb_`var_short' = (3,2), border(all, nil)

	// Identifying label and type
	local lab : var label `var'
	describe `var', varlist
	capture quietly describe `var', full
	local type : type `var'

	// Adding to the left side
	putdocx table cb_`var_short'(1,1) = ("Type: `type'")
	putdocx table cb_`var_short'(2,1) = ("Label: `lab'")

	// Generating summary statistics
	count if mi(`var')
	local n_miss = r(N)

	count if !mi(`var')
	local n_nonmiss = r(N)

	// Adding to the right side
	putdocx table cb_`var_short'(1,2) = ("Valid Cases: `n_nonmiss'")
	putdocx table cb_`var_short'(2,2) = ("Invalid Cases: `n_miss'")
	
	quietly distinct `var'
	local num_unique = r(ndistinct)

	putdocx table cb_`var_short'(3,2) = ("Unique Values: `num_unique'")
	

	// Adding examples 	
	putdocx paragraph
	putdocx text ("Examples:"), bold linebreak
	
	if `num_unique' < 65000 {
		
		// Get the unique levels of the variable
		quietly levelsof `var', local(unique_vals)

		// Initialize a counter
		local i = 1
		
		// Loop through the unique values and process the first 5
		foreach val of local unique_vals {
			if `i' > 5 {
				continue
			}

			// Capture the command that might throw an error
			capture {
				putdocx text ("`val'"), linebreak
			}

			// Check if an error occurred
			if _rc {
				display "An error occurred at iteration `i'."
				local ++i 
				continue
			} 
			
			// Increment the counter
			local ++i
			display "`i'"
		}
	}
	
	// Space for additional information
	putdocx paragraph, shading(lavender)
	putdocx text ("Additional"), bold font(,12)
	

	putdocx paragraph
	putdocx text ("Variable Description"), bold
	putdocx paragraph
	putdocx text (" ")

	putdocx paragraph
	putdocx text ("Variable Caveats"), bold
	putdocx paragraph
	putdocx text (" ")

end

	
// Create list of .dta files

local datasets ""

	
// Start the Word doc
putdocx clear
putdocx begin, header(head1) font(Times New Roman)

// Add content to the header
putdocx paragraph, toheader(head1) halign(right)
putdocx text ("Data Repository 2024")

// Add a title
putdocx paragraph, style(Title)
putdocx text ("Data Set Codebook")

// Add another subheading (e.g., agency)
putdocx paragraph, style(Heading1)
putdocx text ("SUBHEADING")

// Add another subheading
putdocx paragraph, style(Heading2)
putdocx text ("ANOTHER SUBHEADING")

// Cover page table of datasets
local ndatasets : word count `datasets' 
local num_row = `ndatasets' + 1

display "`num_row'"

putdocx paragraph
putdocx table head_table = (`num_row', 4), border(start, nil) border(insideV, nil) border(end, nil) border(top, nil)
putdocx table head_table(2, .), border(top, nil)

putdocx table head_table(1,1) = ("File"), bold
putdocx table head_table(1,2) = ("Raw Data File prefix"), bold
putdocx table head_table(1,3) = ("CECIDS File prefix"), bold
putdocx table head_table(1,4) = ("EC*REACH File prefix"), bold

local i = 2
foreach dataset of local datasets {
	
	putdocx table head_table(`i',2) = ("`dataset'")
	local i = `i' + 1	
}


putdocx pagebreak

// Initialize the total variable count to zero
local total_var_count = 0

// Loop through each dataset
foreach file of local datasets {
    // Load the dataset
    use `file', clear
    
    // Count the number of variables
    describe
    
    // Extract the number of variables from the describe output
    local var_count = r(k)
    
    // Add to the total variable count
    local total_var_count = `total_var_count' + `var_count'
}


// Creating table with all variables and corresponding dataset
putdocx paragraph, halign(center)
putdocx text ("EC*REACH Early Childhood Research Data"), bold font(,16)

putdocx paragraph, halign(center)
putdocx text ("Codebook"), bold font(14)
	
putdocx paragraph, halign(center)
local num_row = `total_var_count' + `total_var_count'+ 1
putdocx table vartable = (`num_row', 3), border(all, nil)

// Table header
putdocx table vartable(1,1) = ("Variable"), bold
putdocx table vartable(1,2) = ("Label"), bold
putdocx table vartable(1,3) = ("Dataset"), bold
 

// Index starting at 2
local i = 2

// Generating list of all variables with corresponding dataset
foreach file of local datasets { 
	use `file', clear
	
	// Get all variables in the dataset
	ds
	local all_vars `r(varlist)'
	
	// Get name of dataset
	local dataset_name = "`c(filename)'"
	
	foreach var of local all_vars { 
		putdocx table vartable(`i',1) = ("`var'")
		
		local lab : var label `var'
		putdocx table vartable(`i',2) = ("`lab'")
		
		putdocx table vartable(`i',3) = ("`dataset_name'")
		local i = `i' + 2	
	}	
}

// Iterating each dataset to get variable details and run corresponding program
foreach dataset of local datasets {
	
	use `dataset', clear
	
	// Creating macro of string variables
	ds, has(type string)
	local string_vars `r(varlist)'

	// Creating macro of numeric variables
	ds, has(type numeric)
	local numeric_vars `r(varlist)'

	// Creating macro of all variables
	ds
	local all_vars `r(varlist)'
	
	// Creating macro for the dataset name
	local dataset_name = substr("`c(filename)'", 1, strpos("`c(filename)'", ".") - 1)
	
	// Getting number of variables
	local nvars = c(k)

	* Getting number of observations
	local nobs = c(N)
	
	// Dataset cover page
	
	putdocx pagebreak
	
	putdocx paragraph 
	putdocx text ("`dataset'"), bold font(,16)
	
	putdocx paragraph, shading(lavender)
	putdocx text ("Variables: `nvars' "), font(,12) linebreak
	putdocx text ("Observations: `nobs'"), font(,12) linebreak
	putdocx text ("Raw File(s): "), font(,12) linebreak
	putdocx text ("Code File(s): "), font(,12)
	
	putdocx paragraph, shading(lavender)
	putdocx text ("GitHub: "), font(,12) linebreak
	putdocx text ("File Description:"), font(,12) linebreak linebreak linebreak linebreak linebreak

	
	
// Nested for loop to process each variable
foreach var of local all_vars {
	// Initialize a flag 
	local is_num = 0
	
	// Check if the variable is in numeric variables list
	foreach numvar of local numeric_vars {
		if "`var'" == "`numvar'" {
			local is_num = 1
		}       
	}
	// Run codebook_cont_num program for numeric variables
	if `is_num' == 1 {
		
		local label_name :value label `var' 
		
		// Run program for numeric categorical variables if value labels are found
		if ("`label_name'" != ""){
		
		codebook_cat_num `var' `label_name' `dataset_name'
		
		}
		else{
			local format: format `var'
	
			// Handle date variables if found
			if strpos("`format'", "%td") {
				
				codebook_td_date `var' `dataset_name'
			}
			else{
				
				// Run program for continuous numeric variables	
				codebook_cont_num `var' `dataset_name'
			
			}
		
		}
	}
	// Handling str variables
	else {
		
		// Calculate the number of distinct values
		qui: distinct `var'
		local num_distinct = r(ndistinct)

		// Run the appropriate program based on the number of distinct values
		if `num_distinct' <= 10 {
			codebook_cat_str `var' `dataset_name'
		} 
		else {
			codebook_str `var' `dataset_name'
			}
		}
	}
}

putdocx save data_set_codebook, replace

set rmsg off
set trace off
exit