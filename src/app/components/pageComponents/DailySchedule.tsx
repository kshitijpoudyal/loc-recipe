import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import Image from 'next/image';
import {MealType, Recipe, WeekDay} from "@/app/data/DataInterface";
import {DEFAULT_RECIPE, MEAL_TYPES, WEEK_DAYS} from "@/app/data/ConstData";
import {fetchAllDailySchedules, mapAllRecipesToSchedule, updateSchedule} from "@/app/utils/firebaseUtils/DailySchedule";
import {useRecipes} from "@/app/components/baseComponents/RecipeProvider";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";
import {AssignRecipeToWeekDay, AssignRecipeToWeekDayProps} from "@/app/components/AssignRecipeToWeekDay";
import RecipeDetailsTemplate from "@/app/components/RecipeDetailsTemplate";

const DAY_SHORT: Record<string, string> = {
    Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
    Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

const MEAL_TIMES: Record<string, string> = {
    breakfast: '08:30 AM',
    lunch: '01:00 PM',
    dinner: '07:30 PM',
};


const TODAY = new Date().toLocaleDateString('en-US', {weekday: 'long'}).toLowerCase();

export default function DailyScheduleComponent() {
    const {recipes: allRecipe} = useRecipes();
    const {user} = useAuth();
    const [recipesMap, setRecipesMap] = useState<Record<string, Record<MealType, Recipe[]>>>({});
    const [selectedDay, setSelectedDay] = useState<string>(TODAY);
    const [loading, setLoading] = useState(true);
    const [refreshingDay, setRefreshingDay] = useState<string | null>(null);
    const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
    const [isRecipeDetailsOpen, setIsRecipeDetailsOpen] = useState(false);
    const [selectedRecipeForDetails, setSelectedRecipeForDetails] = useState<Recipe>(DEFAULT_RECIPE);
    const editingDayRef = useRef<string | null>(null);

    const weekDates = useMemo(() => {
        const today = new Date();
        const dow = today.getDay(); // 0=Sun
        const monday = new Date(today);
        monday.setDate(today.getDate() + (dow === 0 ? -6 : 1 - dow));
        return WEEK_DAYS.reduce((acc, day, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            acc[day.value] = d.getDate();
            return acc;
        }, {} as Record<string, number>);
    }, []);

    const { weekLabel, monthAbbr } = useMemo(() => {
        const today = new Date();
        const dow = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() + (dow === 0 ? -6 : 1 - dow));
        return {
            weekLabel: monday.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
            monthAbbr: monday.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        };
    }, []);

    const loadSchedule = useCallback(async () => {
        if (!user?.uid) return;
        try {
            const dailySchedules = await fetchAllDailySchedules(user.uid);
            setRecipesMap(mapAllRecipesToSchedule(allRecipe, dailySchedules));
        } catch (error) {
            console.error("Error loading schedule:", error);
        } finally {
            setLoading(false);
            setRefreshingDay(null);
        }
    }, [allRecipe, user?.uid]);

    const handleRemoveRecipe = useCallback(async (day: WeekDay, mealType: MealType, recipeId: string) => {
        if (!user?.uid) return;
        setRefreshingDay(day.value);
        const remaining = (recipesMap[day.value]?.[mealType] ?? [])
            .map(r => r.recipeId!)
            .filter(id => id !== recipeId);
        await updateSchedule(day.value, mealType, remaining, user.uid);
        await loadSchedule();
    }, [user?.uid, loadSchedule, recipesMap]);

    const callbackAfterRecipeChange = useCallback((isOpen: boolean, refresh?: boolean) => {
        setIsAddRecipeOpen(isOpen);
        if (refresh) {
            setRefreshingDay(editingDayRef.current);
            loadSchedule();
        }
    }, [loadSchedule]);

    const [recipeToWeekDayProps, setRecipeToWeekDayProps] = useState<AssignRecipeToWeekDayProps>({
        isOpen: false,
        recipes: [DEFAULT_RECIPE],
        setIsOpenAction: callbackAfterRecipeChange,
        weekDay: WEEK_DAYS[0],
        mealType: MEAL_TYPES[0],
        selectedRecipeList: [DEFAULT_RECIPE],
    });

    useEffect(() => {
        loadSchedule();
    }, [loadSchedule]);

    const handleAddClick = useCallback(
        (day: WeekDay, mealType: MealType, selectedRecipes: Recipe[]) => {
            editingDayRef.current = day.value;
            setIsAddRecipeOpen(true);
            setRecipeToWeekDayProps({
                isOpen: true,
                recipes: allRecipe,
                setIsOpenAction: callbackAfterRecipeChange,
                weekDay: day,
                mealType: mealType,
                selectedRecipeList: selectedRecipes ?? [],
            });
        },
        [allRecipe, callbackAfterRecipeChange]
    );


    function renderMealSlot(day: WeekDay, mealType: MealType, heightClass = 'h-[180px]') {
        if (refreshingDay === day.value) {
            return (
                <div key={mealType} className={`shimmer rounded-xl ${heightClass}`}/>
            );
        }
        const recipes = recipesMap[day.value]?.[mealType] ?? [];
        const firstRecipe = recipes[0];

        if (!firstRecipe) {
            return (
                <div
                    key={mealType}
                    onClick={() => handleAddClick(day, mealType, [])}
                    className={`bg-surface-container-low/50 border-2 border-dashed border-outline-variant/30 rounded-xl p-4 ${heightClass} flex flex-col items-center justify-center text-outline-variant hover:border-primary/40 hover:text-primary transition-all cursor-pointer`}
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    <span className="text-[10px] font-label font-bold uppercase tracking-widest mt-1">{mealType}</span>
                </div>
            );
        }

        // Single recipe with image — hero card
        if (recipes.length === 1 && firstRecipe.imageUrl) {
            return (
                <div key={mealType} className={`group relative overflow-hidden rounded-xl ${heightClass} w-full shadow-sm cursor-pointer`}
                    onClick={() => { setIsRecipeDetailsOpen(true); setSelectedRecipeForDetails(firstRecipe); }}>
                    <Image src={firstRecipe.imageUrl} alt={firstRecipe.name}
                        width={600} height={400}
                        className="absolute inset-0 w-full h-full object-cover grayscale-[0.1] group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent pointer-events-none"/>
                    <div className="absolute bottom-0 left-0 p-3 w-full pointer-events-none">
                        <span className="font-label text-[10px] uppercase tracking-tighter text-white/70 font-bold mb-1 block">{mealType}</span>
                        <p className="font-headline text-sm font-semibold text-white leading-tight">{firstRecipe.name}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleAddClick(day, mealType, recipes); }}
                        className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors md:opacity-0 md:group-hover:opacity-100">
                        <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                </div>
            );
        }

        // Multiple recipes — stacked list
        return (
            <div key={mealType} className="rounded-xl overflow-hidden border border-outline-variant/20">
                {/* Meal label header */}
                <div className="flex items-center justify-between px-3 py-2 bg-surface-container-high">
                    <span className="font-label text-[10px] uppercase tracking-widest font-bold text-outline">{mealType}</span>
                    <button onClick={() => handleAddClick(day, mealType, recipes)}
                        className="text-primary hover:bg-primary/10 rounded-full p-0.5 transition-colors">
                        <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                </div>
                {/* Recipe rows */}
                <div className="divide-y divide-outline-variant/10 bg-surface-container-low">
                    {recipes.map((recipe) => (
                        <div key={recipe.recipeId}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-surface-container transition-colors group"
                            onClick={() => { setIsRecipeDetailsOpen(true); setSelectedRecipeForDetails(recipe); }}>
                            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high">
                                {recipe.imageUrl ? (
                                    <Image src={recipe.imageUrl} alt={recipe.name} width={32} height={32} className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-outline-variant" style={{fontSize: '14px'}}>restaurant</span>
                                    </div>
                                )}
                            </div>
                            <p className="font-body text-xs flex-1 min-w-0 truncate group-hover:text-primary transition-colors">{recipe.name}</p>
                            <span className="material-symbols-outlined text-outline-variant text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    function renderMobileMealSlot(day: WeekDay, mealType: MealType) {
        if (refreshingDay === day.value) {
            return (
                <div key={mealType} className="space-y-3">
                    <div className="shimmer h-6 w-40 rounded-lg"/>
                    <div className="shimmer rounded-xl h-32"/>
                </div>
            );
        }
        const recipes = recipesMap[day.value]?.[mealType] ?? [];
        const firstRecipe = recipes[0];

        return (
            <div key={mealType} className="space-y-3">
                <div className="flex justify-between items-end">
                    <h3 className="font-headline text-xl text-on-surface flex items-center gap-2">
                        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                        <span className="font-body text-xs text-outline font-normal italic">{MEAL_TIMES[mealType]}</span>
                    </h3>
                    {firstRecipe && (
                        <span className="text-[10px] font-label uppercase tracking-widest text-primary font-bold">Planned</span>
                    )}
                </div>

                {!firstRecipe ? (
                    <button
                        onClick={() => handleAddClick(day, mealType, [])}
                        className="w-full h-24 rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface-container-low/50 flex flex-col items-center justify-center active:scale-[0.98] transition-transform"
                    >
                        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center mb-1 text-primary">
                            <span className="material-symbols-outlined">add</span>
                        </div>
                        <span className="font-label text-[10px] uppercase tracking-widest text-outline font-semibold">Assign Recipe</span>
                    </button>
                ) : (
                    <div
                        className="bg-surface-container-lowest rounded-xl overflow-hidden flex shadow-sm h-32 cursor-pointer"
                        onClick={() => { setIsRecipeDetailsOpen(true); setSelectedRecipeForDetails(firstRecipe); }}
                    >
                        <div className="w-1/3 h-full overflow-hidden flex-shrink-0">
                            {firstRecipe.imageUrl ? (
                                <Image
                                    src={firstRecipe.imageUrl}
                                    alt={firstRecipe.name}
                                    width={120}
                                    height={128}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline-variant">restaurant</span>
                                </div>
                            )}
                        </div>
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                            <div>
                                {firstRecipe.mealType && firstRecipe.mealType.length > 0 && (
                                    <div className="flex gap-2 mb-1">
                                        <span className="bg-secondary-fixed text-on-secondary-fixed text-[9px] px-2 py-0.5 rounded-full font-label uppercase font-bold tracking-tighter">
                                            {firstRecipe.mealType[0]}
                                        </span>
                                    </div>
                                )}
                                <h4 className="font-headline text-base leading-tight text-on-surface">{firstRecipe.name}</h4>
                            </div>
                            <div className="flex justify-between items-center">
                                {((firstRecipe.prepTime ?? 0) + (firstRecipe.cookTime ?? 0) > 0) && (
                                    <span className="font-body text-xs text-outline italic">
                                        {(firstRecipe.prepTime ?? 0) + (firstRecipe.cookTime ?? 0)}m total
                                    </span>
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleAddClick(day, mealType, recipes); }}
                                    className="ml-auto text-outline hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (loading) return (
        <div className="pb-12 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
            {/* Mobile shimmer */}
            <div className="md:hidden space-y-8">
                <div className="shimmer h-4 w-28 rounded-full"/>
                <div className="shimmer h-9 w-64 rounded-xl"/>
                <div className="flex gap-1">
                    {Array.from({length: 7}).map((_, i) => (
                        <div key={i} className="flex-1 shimmer h-12 rounded-lg"/>
                    ))}
                </div>
                {Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="shimmer h-5 w-24 rounded-lg"/>
                        <div className="shimmer rounded-xl h-[130px]"/>
                    </div>
                ))}
            </div>
            {/* Tablet shimmer */}
            <div className="hidden md:block lg:hidden space-y-6">
                <div className="shimmer h-9 w-48 rounded-xl"/>
                <div className="shimmer h-3 w-40 rounded-full"/>
                <div className="flex gap-2">
                    {Array.from({length: 7}).map((_, i) => (
                        <div key={i} className="shimmer h-16 w-14 rounded-2xl flex-shrink-0"/>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {Array.from({length: 3}).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="shimmer h-6 w-28 rounded-lg"/>
                            <div className="shimmer rounded-xl h-32"/>
                        </div>
                    ))}
                </div>
            </div>
            {/* Desktop shimmer */}
            <div className="hidden lg:grid grid-cols-12 gap-8">
                <div className="col-span-9">
                    <header className="mb-10">
                        <div className="shimmer h-3 w-28 rounded-full mb-3"/>
                        <div className="shimmer h-10 w-80 rounded-xl"/>
                    </header>
                    <div className="grid grid-cols-7 gap-4">
                        {Array.from({length: 7}).map((_, dayIdx) => (
                            <div key={dayIdx} className="col-span-1 flex flex-col gap-4">
                                <div className="pb-2 border-b border-outline-variant/20">
                                    <div className="shimmer h-6 w-10 rounded-lg"/>
                                </div>
                                <div className="space-y-3">
                                    {Array.from({length: 3}).map((_, slotIdx) => (
                                        <div key={slotIdx} className="shimmer rounded-xl h-[180px]"/>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <aside className="col-span-3">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-surface-container-low rounded-3xl p-6 space-y-6">
                            <div className="shimmer h-3 w-36 rounded-full"/>
                            <div className="shimmer h-6 w-44 rounded-xl"/>
                            {Array.from({length: 3}).map((_, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="shimmer w-16 h-16 rounded-xl flex-shrink-0"/>
                                    <div className="flex-grow space-y-2">
                                        <div className="shimmer h-4 w-full rounded-lg"/>
                                        <div className="shimmer h-3 w-2/3 rounded-lg"/>
                                    </div>
                                </div>
                            ))}
                            <div className="shimmer h-12 w-full rounded-full"/>
                        </div>
                        <div className="shimmer h-28 rounded-3xl"/>
                    </div>
                </aside>
            </div>
        </div>
    );

    return (
        <div>
            {isAddRecipeOpen && <AssignRecipeToWeekDay {...recipeToWeekDayProps}/>}
            {isRecipeDetailsOpen && (
                <RecipeDetailsTemplate
                    isOpen={isRecipeDetailsOpen}
                    recipe={selectedRecipeForDetails}
                    setIsOpenAction={setIsRecipeDetailsOpen}
                />
            )}

            <div className="pb-12 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">

                {/* ── Mobile layout ── */}
                <div className="md:hidden pb-8">

                    <header className="mb-8">
                        <span className="font-label text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">Weekly Schedule</span>
                        <h1 className="font-headline text-3xl font-bold tracking-tight">Your Editorial Kitchen</h1>
                    </header>

                    {/* Day tab row */}
                    <div className="flex gap-1 border-b border-outline-variant/20 mb-8 overflow-x-auto scrollbar-hide">
                        {WEEK_DAYS.map((day) => {
                            const isActive = day.value === selectedDay;
                            const isToday = day.value === TODAY;
                            return (
                                <button
                                    key={day.id}
                                    onClick={() => setSelectedDay(day.value)}
                                    className={`flex-1 min-w-[44px] flex flex-col items-center pb-3 pt-1 relative transition-all ${
                                        isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    <span className={`font-label uppercase tracking-widest font-bold transition-all ${isActive ? 'text-[10px] text-primary' : 'text-[9px]'}`}>
                                        {DAY_SHORT[day.name]}
                                    </span>
                                    <span className={`font-headline font-bold leading-none transition-all mt-0.5 ${isActive ? 'text-3xl' : 'text-base'}`}>
                                        {weekDates[day.value]}
                                    </span>
                                    {isToday && !isActive && (
                                        <span className="w-1 h-1 rounded-full bg-primary mt-1"/>
                                    )}
                                    {isToday && isActive && (
                                        <span className="font-label text-[8px] uppercase tracking-widest font-bold mt-0.5 text-primary/60">Today</span>
                                    )}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary rounded-full"/>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Vertical meal list for selected day */}
                    {WEEK_DAYS.filter(d => d.value === selectedDay).map(day => (
                        <div key={day.id} className="space-y-6">
                            {MEAL_TYPES.map(mealType => renderMobileMealSlot(day, mealType))}
                        </div>
                    ))}

                </div>

                {/* ── Tablet layout ── */}
                <div className="hidden md:block lg:hidden pb-8">

                    <header className="mb-8">
                        <span className="font-label text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">Weekly Schedule</span>
                        <h1 className="font-headline text-4xl font-bold tracking-tight">Your Editorial Kitchen</h1>
                    </header>

                    {/* Day tab row — styled like desktop column headers */}
                    <div className="flex gap-1 border-b border-outline-variant/20 mb-8 overflow-x-auto scrollbar-hide">
                        {WEEK_DAYS.map((day) => {
                            const isActive = day.value === selectedDay;
                            const isToday = day.value === TODAY;
                            return (
                                <button
                                    key={day.id}
                                    onClick={() => setSelectedDay(day.value)}
                                    className={`flex-1 min-w-[56px] flex flex-col items-center pb-3 pt-1 relative transition-all ${
                                        isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    <span className={`font-label uppercase tracking-widest font-bold transition-all ${isActive ? 'text-xs text-primary' : 'text-[10px]'}`}>
                                        {DAY_SHORT[day.name]}
                                    </span>
                                    <span className={`font-headline font-bold leading-none transition-all mt-0.5 ${isActive ? 'text-4xl' : 'text-lg'}`}>
                                        {weekDates[day.value]}
                                    </span>
                                    {isToday && !isActive && (
                                        <span className="w-1 h-1 rounded-full bg-primary mt-1"/>
                                    )}
                                    {isToday && isActive && (
                                        <span className="font-label text-[8px] uppercase tracking-widest font-bold mt-1 text-primary/60">Today</span>
                                    )}
                                    {/* Active underline */}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"/>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* 3-column meal grid — same cards as desktop */}
                    {WEEK_DAYS.filter(d => d.value === selectedDay).map(day => (
                        <div key={day.id} className="grid grid-cols-3 gap-4">
                            {MEAL_TYPES.map(mealType => (
                                <div key={mealType} className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                                        <span className="font-headline text-base font-bold text-on-surface">
                                            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                                        </span>
                                        <span className="font-body text-[10px] text-outline italic">{MEAL_TIMES[mealType]}</span>
                                    </div>
                                    {renderMealSlot(day, mealType)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* ── Desktop layout ── */}
                <div className="hidden lg:grid grid-cols-12 gap-8">

                    {/* Weekly Planner */}
                    <div className="col-span-9">
                        <header className="mb-10">
                            <span className="font-label text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">Weekly Schedule</span>
                            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Your Editorial Kitchen</h1>
                        </header>

                        <div className="grid grid-cols-7 gap-4">
                            {WEEK_DAYS.map((day) => {
                                const isSelected = day.value === selectedDay;
                                const isToday = day.value === TODAY;
                                return (
                                    <div
                                        key={day.id}
                                        className={`col-span-1 flex flex-col gap-4 rounded-2xl transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 px-2 py-3 -mx-2' : ''}`}
                                        onClick={() => setSelectedDay(day.value)}
                                    >
                                        <div className={`pb-2 border-b ${isSelected ? 'border-primary/30' : 'border-outline-variant/20'}`}>
                                            <h2 className={`font-headline text-xl font-bold ${isSelected ? 'text-primary' : ''}`}>
                                                {DAY_SHORT[day.name]}
                                                {isToday && <span className="ml-1.5 text-[9px] font-label font-bold uppercase tracking-widest text-primary/70">Today</span>}
                                            </h2>
                                        </div>
                                        <div className="space-y-3">
                                            {MEAL_TYPES.map(mealType => renderMealSlot(day, mealType))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="col-span-3">
                        <div className="sticky top-28">
                            <div className="bg-surface-container-low rounded-3xl p-6 overflow-hidden relative">
                                <div className="relative z-10">
                                    <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block">Curated Just For You</span>
                                    <h2 className="font-headline text-2xl font-bold mb-6">Recommendations</h2>
                                    <div className="space-y-6">
                                        {allRecipe.slice(0, 3).map(recipe => (
                                            <div
                                                key={recipe.recipeId}
                                                className="group cursor-pointer"
                                                onClick={() => {
                                                    setIsRecipeDetailsOpen(true);
                                                    setSelectedRecipeForDetails(recipe);
                                                }}
                                            >
                                                <div className="flex gap-4 items-start">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high">
                                                        {recipe.imageUrl ? (
                                                            <Image
                                                                src={recipe.imageUrl}
                                                                alt={recipe.name}
                                                                width={64}
                                                                height={64}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-outline-variant">restaurant</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h3 className="font-headline text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
                                                            {recipe.name}
                                                        </h3>
                                                        <div className="flex gap-2 mt-2 items-center flex-wrap">
                                                            {recipe.mealType?.slice(0, 1).map(tag => (
                                                                <span key={tag} className="bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full text-[9px] font-bold font-label uppercase tracking-tighter">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                            {((recipe.prepTime ?? 0) + (recipe.cookTime ?? 0) > 0) && (
                                                                <span className="text-[10px] text-outline font-label">
                                                                    {(recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)}m
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-10 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-label text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                        View Full Library
                                    </button>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"/>
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"/>
                            </div>

                            <div className="mt-6 p-6 bg-surface-container-high rounded-3xl border border-outline-variant/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-secondary">flare</span>
                                    <h4 className="font-label text-[10px] font-bold uppercase tracking-widest">Chef&apos;s Note</h4>
                                </div>
                                <p className="font-headline text-xs leading-relaxed italic text-on-surface-variant">
                                    &quot;Plan your week with seasonal ingredients. Prep sauces and bases on the weekend to save time on weeknights.&quot;
                                </p>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
