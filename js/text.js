//labels and text for categories and metrics - baking this into the html for now
/*
var catname = {
    main: "Population",
    origin: "Country of origin",
    citizenship: "Citizenship",
    edukids: "Education of children",
    edupar: "Education of parents",
    engkids: "English proficiency of children",
    engpar: "English proficiency of parents",
    numkids: "Number of children in household",
    numpar: "Number of parents in household",
    incbenefits: "Income and benefits"
};
*/

//text for levels of categories - don't bother with the csvs! make all edits here
var levels = {
    main: ["Share of all children who are COI", "Total number", "Percent of national total"],
    age: ["Age 0 to 3", "Age 4 to 5", "Age 6 to 12", "Age 13 to 17"],
    origin: ["Mexico", "Other Central America & Spanish Caribbean", "Europe, Canada & Australia", "East Asia & Pacific", "Africa", "The Middle East & South Asia", "South America", "Southeast Asia"],
    citizenship: ["Citizen with citizen parents", "Citizen with non-citizen parents", "Non-citizen"],
    edukids: ["Not in school, age 3 to 5", "Not in school, age 6 to 17"],
    edupar: ["Less than a high school degree", "High school degree", "At least four year college degree"],
    engkids: ["English Proficient", "With Limited English Proficiency"],
    engpar: ["English proficient parents", "At least one Limited English Proficient parent", "No English proficient parents", "Who live in Linguistically Isolated Households"],
    numkids: ["1", "2", "3-4", "5+"],
    numpar: ["Single parent", "Two parent"],
    incbenefits: ["In families below 100% of the poverty line", "In families below 200% of the poverty line",
"Working family", "In low income working family", "Household owns home"]
};

//sumamary text for each category
var cattext = {
    main: "From 2006 to 2009, the number of children of immigrants in the United States steadily grew from 15.7 million to 16.8 million; from 2010 to 2011 the growth stagnated increasing at one third the rate of the previous three years.  The share, however, continued to grow steadily as the number of native born children actually fell during that time period.",
    age: "Share of children that are children of immigrants in a certain age group.",
    origin: "From a policy perspective country of origin is particularly important; it will influence the types of language accessibility programs necessary to serve students and their parents.  While the overall distribution of country of origin of parents of children of immigrants has not changed substantially, some consistent trends are developing, for instance there has been a steady decrease in children with parents from Europe or Canada and an increase in children with parents from the Middle East & South Asia.",
    citizenship: "Because citizenship often determines eligibility for many federal programs aimed at low income families, understanding the distribution of citizenship among children of immigrants is vital for making decisions about supplemental state programs for non-citizens.  While the share of children of immigrants in the US who are not citizens has steadily declined from 14% in 2006 to 11% in 2011, the share of citizen children with noncitizen parents has grown from 30% to 33%.  Non-citizen parents are less likely to participate in programs like SNAP or TANF even when their citizen children are eligible, implying that outreach may become an important factor in ensuring this group does not fall through the social safety net. <br><br><b>Related:</b> ASPE Barriers to Immigrant access.",
    edukids: "From 2006 to 2011 the percentage of children in each age group who are children of immigrants has increased, with the exception of the 0 to 3 years old age group, which did not change. Their participation rates in school have been increasing for both pre-school and kindergarten through high school.",
    edupar: "The share of children of immigrants with at least one parent with a college education has increased.",
    engkids: "English proficiency of both children of immigrants and their immigrant parents is very important for language accessibility policies. Parents with limited or no English proficiency may experience difficulties navigating schools, health providers, and other public and private community institutions <a href='http://www.urban.org/' target='_blank'>(Holcomb et al. 2003).</a> While the share of children of immigrants with limited English proficiency has fallen from 19% in 2006 to 16% in 2011, the share of children of immigrants who have no English proficient parent has remained steady at around 44%.",
    engpar: "English proficiency of both children of immigrants and their immigrant parents is very important for language accessibility policies. Parents with limited or no English proficiency may experience difficulties navigating schools, health providers, and other public and private community institutions <a href='http://www.urban.org/' target='_blank'>(Holcomb et al. 2003).</a> While the share of children of immigrants with limited English proficiency has fallen from 19% in 2006 to 16% in 2011, the share of children of immigrants who have no English proficient parent has remained steady at around 44%.",
    numkids: "Children of immigrants are also more likely to have a large number of siblings, with 64% of children of immigrants living in families with more than four children versus 50% of children of native born parents.",
    numpar: "Children of immigrants are much more likely to live in two parent homes than children of native-born parents. While the share of children of immigrants with single parents is increasing it is increasing very slowly.",
    incbenefits: "While there was an overall increase in the share of children below the poverty line, children of immigrants were especially affected, despite being more likely to be in families with at least one parent working.  While the share of children of immigrants living in poor families actually declined from 2006 to 2008, the share jumped from 20% in 2008 to 26% in 2011."
};