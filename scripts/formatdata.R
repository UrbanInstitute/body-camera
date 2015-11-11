#Hannah Recht, 10-20-15
#Format Children of Immigrants data
#Two original CSVs: state-level and CBSA-level (100 most populous)
#End result: areadata.csv has rows for each geography*metric with columns for each year of data (2007-2013)
#Use original statcodes but create new metric categories and numbers for grouping

library(dplyr)
library(tidyr)
library(doBy)

states<-read.csv("../higher-ed/data/states.csv",stringsAsFactors = F)
st<-read.csv("data/original/InteractiveMap_State2013_11_09_2015.csv",stringsAsFactors = F)
mt<-read.csv("data/original/metrodata.csv",stringsAsFactors = F)

states <- states %>% select(statefip,abbrev) %>% rename (fips=statefip)
st <- st %>% rename(name=StateName,abbrev=StateCode,category=GROUPCODE,statcode=STATCODE,statlabel=STAT,isstate=ISSTATE)
#low sample size flag: -97
st[st == -97] <- NA
st <- left_join(states,st,by="abbrev")

#dataset of the metrics used and their descriptions - will need to edit
metrics <- summaryBy(isstate ~ category + statcode + statistics_label + statlabel + statid, data=st) %>% 
  select(-isstate.mean) %>% 
  arrange(statid)
write.csv(metrics, "data/metrics.csv", na="", row.names=F)

mt <- mt %>% rename(name=MetroName,fips=MetroCode,category=GROUPCODE,statcode=STATCODE,statlabel=STAT,isstate=ISSTATE)
dt <- bind_rows(st,mt)

#join new metric ids to wide data
metrics<-read.csv("data/metrics_edited.csv", stringsAsFactors = F)
metrics <- metrics %>% select(statcode,cat,catnum,level)
dt <- left_join(dt,metrics,by="statcode")
dt <- dt %>% select(c(cat,catnum,level,statcode,statlabel,fips,abbrev,name),everything()) %>% 
  select(-c(category,statid,statistics_label,statlabel))
dt <- dt %>% arrange(catnum,level)

write.csv(dt, "data/areadata.csv", na="", row.names=F)

#Make data long
# formatLong <- function(dt) {
#   long <- dt %>% gather(year,value,6:13)
#   long$year <- as.character(long$year)
#   long <- long %>% mutate(year=sapply(strsplit(long$year, split='y', fixed=TRUE),function(x) (x[2])))
#   long$year <- as.numeric(long$year)
#   long <- long 
# }
# st2 <- st %>% select(fips,name,isstate,category,statcode,y2006,y2007,y2008,y2009,y2010,y2011,y2012,y2013)
# st_long <- formatLong(st2)
# write.csv(st_long, "data/areadata_long.csv", na="", row.names=F)