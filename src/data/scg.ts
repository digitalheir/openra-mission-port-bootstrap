export const scg01ea = `
[BASIC]
CarryOverCap=-1
CarryOverMoney=0
Intro=x
BuildLevel=1
Theme=No theme
Percent=0
Player=GoodGuy
Win=CONSYARD
Lose=GAMEOVER
Brief=GDI1
Action=LANDING

[MAP]
TacticalPos=3438
Height=23
Width=26
Y=39
X=36
Theater=TEMPERATE

[GoodGuy]
FlagHome=0
FlagLocation=0
MaxBuilding=150
Allies=GoodGuy,Neutral; this is a comme;nt
MaxUnit=150
Credits=20
Edge=South

[BadGuy]
FlagHome=0
FlagLocation=0
MaxBuilding=150
Allies=BadGuy
MaxUnit=222
Credits=0
Edge=North

[Neutral]
FlagHome=0
FlagLocation=0
MaxBuilding=150
Allies=Neutral
MaxUnit=150
Edge=North
Credits=0

[UNITS]
001=GoodGuy,BOAT,256,3829,192,Hunt,None
000=GoodGuy,MCV,256,3448,0,Guard,None

[INFANTRY]
013=BadGuy,E1,256,2537,4,Hunt,96,None
012=BadGuy,E1,256,2672,2,Area Guard,96,None
011=BadGuy,E1,256,2790,1,Guard,128,None
010=BadGuy,E1,256,2790,4,Guard,128,None
009=BadGuy,E1,256,3056,1,Area Guard,96,None
008=BadGuy,E1,256,3246,3,Area Guard,96,None
007=BadGuy,E1,256,2939,1,Area Guard,160,None
006=BadGuy,E1,256,2672,3,Area Guard,96,None
005=BadGuy,E1,256,2680,2,Area Guard,192,None
004=BadGuy,E1,256,2937,2,Area Guard,160,None
003=GoodGuy,E1,256,3576,1,Guard,0,None
002=GoodGuy,E1,256,3576,3,Guard,0,None
001=GoodGuy,E1,256,3576,4,Guard,0,None
000=GoodGuy,E1,256,3576,2,Guard,0,None

[STRUCTURES]
002=BadGuy,GUN,48,3569,160,None
001=BadGuy,GUN,128,3561,160,None
000=BadGuy,GUN,128,3566,160,None

[TERRAIN]
3111=T02,None
3303=T01,None
2937=T16,None
2938=TC04,None
2680=TC05,None
2936=T01,None
3121=T01,None
3056=TC02,None
3245=T16,None
2991=T01,None
2860=T07,None
2988=T01,None
2861=T02,None
3052=TC02,None
2794=TC04,None
2605=TC05,None
2666=TC01,None
3246=TC01,None
3496=T06,None
3369=T06,None
2416=T01,None
2544=TC02,None
2428=TC01,None
2042=TC01,None
2033=T17,None
2097=T16,None
2032=T07,None
2299=T07,None
2345=T07,None
2408=T06,None
2283=T06,None
2030=T05,None
2207=TC05,None
2213=TC04,None
2399=TC02,None
2871=TC02,None
2016=T01,None
2017=TC02,None
2847=TC02,None
3039=TC05,None
2555=TC01,None

[REINFORCEMENTS]
1=GoodGuy,E1,Beach,0
2=GoodGuy,E1,Beach,1

[TEMPLATE]

[OVERLAY]
3568=SBAG
3567=SBAG
3505=SBAG
3504=SBAG
2428=SBAG
2427=SBAG
2426=SBAG
2425=SBAG
2421=SBAG
2420=SBAG
2419=SBAG
2418=SBAG
2417=SBAG
2416=SBAG
2415=SBAG
2413=SBAG
2412=SBAG
2411=SBAG
2410=SBAG
2364=SBAG
2351=SBAG
2346=SBAG
2300=SBAG
2236=SBAG
2223=SBAG
2221=TI8
2220=TI11
2217=TI5
2172=SBAG
2159=SBAG
2157=TI12
2156=TI11
2155=TI11
2154=TI2
2153=TI4
2152=TI3
2108=SBAG
2095=SBAG
2093=TI10
2092=TI1
2091=TI3
2090=TI10
2089=TI4
2044=SBAG
2043=SBAG
2042=SBAG
2041=SBAG
2040=SBAG
2039=SBAG
2038=SBAG
2036=SBAG
2035=SBAG
2034=SBAG
2033=SBAG
2032=SBAG
2031=SBAG
2027=TI5
2026=TI6
2025=TI3

[SMUDGE]

[Triggers]
RNF4=Time,Reinforce.,10,GoodGuy,GDIR2,0
RFN2=Time,Reinforce.,6,GoodGuy,GDIR1,0
RNF1=Time,Reinforce.,3,GoodGuy,GDIR1,0
LOSE=All Destr.,Lose,0,GoodGuy,None,0
WIN=All Destr.,Win,0,BadGuy,None,0
RNF6=Time,Reinforce.,16,GoodGuy,GDIR2,0
ATK4=Bldgs Destr.,Reinforce.,0,BadGuy,NOD3,0
ATK2=Time,Create Team,0,BadGuy,NOD1,0

[CellTriggers]

[Teams]

[Waypoints]
31=-1
30=-1
29=-1
28=-1
27=3059
26=3376
25=-1
24=-1
23=-1
22=-1
21=-1
20=-1
19=-1
18=-1
17=-1
16=-1
15=-1
14=-1
13=-1
12=-1
11=-1
10=-1
9=-1
8=-1
7=-1
6=-1
5=-1
4=-1
3=3450
2=3572
1=3558
0=2981

[TeamTypes]
GDIR2=GoodGuy,0,0,0,0,0,7,3,0,0,2,JEEP:1,LST:1,0,1,1
NOD1=BadGuy,1,0,0,0,0,20,1,0,0,1,E1:2,4,Move:0,Move:1,Move:2,Attack Units:6,0,0
GDIR1=GoodGuy,0,0,0,0,0,7,3,0,0,2,E1:3,LST:1,0,1,1
NOD3=BadGuy,0,0,1,0,0,7,1,0,0,1,BGGY:1,1,Attack Units:5,1,1

[Base]
Count=0

[Special]
FlagHome=0
FlagLocation=0
Allies=Special
MaxBuilding=150
MaxUnit=150
Edge=North
Credits=0

[Multi1]
FlagHome=0
FlagLocation=0
Allies=Multi1
MaxBuilding=150
MaxUnit=150
Edge=North
Credits=0

[Multi2]
FlagHome=0
FlagLocation=0
Allies=Multi2
MaxBuilding=150
MaxUnit=150
Edge=North
Credits=0

[Multi3]
FlagHome=0
FlagLocation=0
Allies=Multi3
MaxBuilding=150
MaxUnit=150
Edge=North
Credits=0

[Multi4]
FlagHome=0
FlagLocation=0
Allies=Multi4
MaxBuilding=150
MaxUnit=150
Edge=North
Credits=0

[Multi5]
Allies=Multi5
MaxBuilding=150
MaxUnit=150
Edge=North
Credits=0

[Multi6]
Allies=Multi6
MaxBuilding=150
MaxUnit=150
Edge=North
Credits=0`;