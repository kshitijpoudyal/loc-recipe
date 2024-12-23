// import {useEffect, useState} from 'react';
// import {db} from './lib/firebase';
// import {collection, doc, getDoc, getDocs} from 'firebase/firestore';
//
// interface Recipe {
//     id: number;
//     name: string;
//     prepTime: number;
//     cookTime: number;
//     servings: number;
//     mealType: string[];
//     ingredients: { name: string; quantity: number; unit: string }[];
//     steps: string[];
// }
//
// type DaySchedule = {
//     breakfast: string | null;
//     lunch: string | null;
//     dinner: string | null;
// };
//
// const daysOfWeek: string[] = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
// ];
//
// const WeeklySchedule: Record<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday", DaySchedule> = {
//     Monday: { breakfast: null, lunch: null, dinner: null },
//     Tuesday: { breakfast: null, lunch: null, dinner: null },
//     Wednesday: { breakfast: null, lunch: null, dinner: null },
//     Thursday: { breakfast: null, lunch: null, dinner: null },
//     Friday: { breakfast: null, lunch: null, dinner: null },
//     Saturday: { breakfast: null, lunch: null, dinner: null },
//     Sunday: { breakfast: null, lunch: null, dinner: null },
// };
//
// const fetchSpecificDocument = async (collectionName: string, documentId: string) => {
//     try {
//         // Create a reference to the specific document
//         const docRef = doc(db, collectionName, documentId);
//
//         // Fetch the document
//         const docSnap = await getDoc(docRef);
//
//         if (docSnap.exists()) {
//             return docSnap.data(); // Returns the document data
//         } else {
//             console.log('No such document!');
//             return null;
//         }
//     } catch (error) {
//         console.error('Error fetching document:', error);
//     }
// };
//
// export default function ViewWeeklySchedule() {
//     const [schedule, setSchedule] = useState<typeof WeeklySchedule>();
//     const [recipes, setRecipes] = useState<{ [id: number]: Recipe }>({});
//     const [openDay, setOpenDay] = useState<string | null>(null);
//     const [openMeal, setOpenMeal] = useState<string | null>(null);
//
//     useEffect(() => {
//         const fetchSchedule = async () => {
//             try {
//
//                 let daysSchedule: typeof WeeklySchedule = {}
//                fetchSpecificDocument('weeklySchedule', "Monday").then((data) => {
//                             daysSchedule.
//                             console.log('Monday data:', data);
//                         });
//
//                 // for (const dayDoc of daysSnapshot.docs) {
//                 //     const day = dayDoc.id;
//                 //     const dayData = dayDoc.data();
//                 //
//                 //     scheduleData[day] = {
//                 //         breakfast: dayData.breakfast,
//                 //         lunch: dayData.lunch,
//                 //         dinner: dayData.dinner,
//                 //     };
//                 // }
//
//                 setSchedule(scheduleList);
//                 console.error('Error fetching weekly schedule:', scheduleList);
//             } catch (error) {
//                 console.error('Error fetching weekly schedule:', error);
//             }
//         }
//
//         const fetchRecipes = async () => {
//             try {
//                 const recipesRef = collection(db, 'recipe');
//                 const recipesSnapshot = await getDocs(recipesRef);
//
//                 const recipesData: { [id: number]: Recipe } = {};
//                 recipesSnapshot.docs.forEach((doc) => {
//                     recipesData[parseInt(doc.id)] = {id: parseInt(doc.id), ...doc.data()} as Recipe;
//                 });
//
//                 setRecipes(recipesData);
//             } catch (error) {
//                 console.error('Error fetching recipes:', error);
//             }
//         };
//
//         fetchSchedule();
//         fetchRecipes();
//     }, []);
//
//     // const toggleDay = (day: string) => {
//     //     setOpenDay(openDay === day ? null : day);
//     // };
//     //
//     // const toggleMeal = (meal: string) => {
//     //     setOpenMeal(openMeal === meal ? null : meal);
//     // };
//
//     return (
//         <div></div>
//         // <div className="max-w-4xl mx-auto p-6">
//         //     <h1 className="text-3xl font-bold text-center mb-6">Weekly Schedule</h1>
//         //     <div className="space-y-4">
//         //         {Object.entries(schedule).map(([day, meals]) => (
//         //             <div key={day} className="border rounded-md shadow-sm">
//         //                 <div
//         //                     onClick={() => toggleDay(day)}
//         //                     className="flex justify-between items-center p-4 bg-indigo-600 text-white cursor-pointer"
//         //                 >
//         //                     <h2 className="text-xl font-semibold">{day}</h2>
//         //                     <span className="text-sm">{openDay === day ? '-' : '+'}</span>
//         //                 </div>
//         //                 {openDay === day && (
//         //                     <div className="p-4 bg-gray-100">
//         //                         {['breakfast', 'lunch', 'dinner'].map((meal) => (
//         //                             <div key={meal} className="mb-4">
//         //                                 <div
//         //                                     onClick={() => toggleMeal(meal)}
//         //                                     className="flex justify-between items-center p-2 bg-indigo-200 cursor-pointer"
//         //                                 >
//         //                                     <h3 className="text-lg font-medium capitalize">{meal}</h3>
//         //                                     <span className="text-sm">{openMeal === meal ? '-' : '+'}</span>
//         //                                 </div>
//         //                                 {openMeal === meal && recipes[meals[meal]] && (
//         //                                     <div className="p-4 bg-white shadow-md rounded-md">
//         //                                         <h4 className="text-lg font-bold">{recipes[meals[meal]].name}</h4>
//         //                                         <div className="space-y-2 mt-2">
//         //                                             <div>
//         //                                                 <span className="font-medium">Prep Time:</span>{' '}
//         //                                                 {recipes[meals[meal]].prepTime} minutes
//         //                                             </div>
//         //                                             <div>
//         //                                                 <span className="font-medium">Cook Time:</span>{' '}
//         //                                                 {recipes[meals[meal]].cookTime} minutes
//         //                                             </div>
//         //                                             <div>
//         //                                                 <span className="font-medium">Servings:</span>{' '}
//         //                                                 {recipes[meals[meal]].servings}
//         //                                             </div>
//         //                                             <div>
//         //                                                 <span className="font-medium">Ingredients:</span>
//         //                                                 <ul className="list-disc pl-6">
//         //                                                     {recipes[meals[meal]].ingredients.map((ingredient, idx) => (
//         //                                                         <li key={idx}>
//         //                                                             {ingredient.quantity} {ingredient.unit} of{' '}
//         //                                                             {ingredient.name}
//         //                                                         </li>
//         //                                                     ))}
//         //                                                 </ul>
//         //                                             </div>
//         //                                             <div>
//         //                                                 <span className="font-medium">Steps:</span>
//         //                                                 <ol className="list-decimal pl-6">
//         //                                                     {recipes[meals[meal]].steps.map((step, idx) => (
//         //                                                         <li key={idx}>{step}</li>
//         //                                                     ))}
//         //                                                 </ol>
//         //                                             </div>
//         //                                         </div>
//         //                                     </div>
//         //                                 )}
//         //                             </div>
//         //                         ))}
//         //                     </div>
//         //                 )}
//         //             </div>
//         //         ))}
//         //     </div>
//         // </div>
//     );
// }
