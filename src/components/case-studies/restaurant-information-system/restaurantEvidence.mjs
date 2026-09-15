// Original report, p.10: parallel product/price arrays. Prices are euros in source.
// English labels are translations; IDs and cents representation are reconstruction.
export const categories = [
  {
    id: "mains",
    name: "Mains",
    items: [
      ["gyros", "Gyros", "Γύρος", 8],
      ["bifteki", "Beef patty", "Μπιφτέκι", 7],
      ["steak", "Steak", "Μπριζόλα", 8],
      ["chops", "Chops", "Παϊδάκια", 7],
      ["souvlaki", "Souvlaki", "Σουβλάκι", 7],
      ["soutzoukaki", "Soutzoukaki", "Σουτζουκάκι", 7],
    ],
  },
  {
    id: "appetizers",
    name: "Appetizers",
    items: [
      ["potatoes", "Potatoes", "Πατάτα", 4],
      ["talagani", "Talagani cheese", "Ταλαγάνι", 4],
      ["cheese-dip", "Cheese dip", "Τυροσαλάτα", 3],
      ["halloumi", "Halloumi", "Χαλούμι", 4],
    ],
  },
  {
    id: "salads",
    name: "Salads",
    items: [
      ["diavasi", "Diavasi salad", "'Διάβαση'", 8],
      ["caesar", "Caesar salad", "Καίσαρα", 8],
      ["cabbage", "Cabbage", "Λάχανο", 5],
      ["broccoli", "Broccoli", "Μπρόκολο", 6],
      ["beetroot", "Beetroot", "Παντζάρι", 6],
      ["green", "Green salad", "Πράσινη", 6],
      ["greek", "Greek salad", "Χωριάτικη", 7],
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    items: [
      ["cola", "Cola", "Κόλα", 2],
      ["wine", "Wine", "Κρασί", 5],
      ["lemonade", "Lemonade", "Λεμονάδα", 2],
      ["water", "Water", "Νερό", 1],
      ["orange", "Orange drink", "Πορτοκαλάδα", 2],
    ],
  },
];
export const menu = categories.flatMap((category) =>
  category.items.map(([id, name, originalLabel, euros]) =>
    Object.freeze({
      id,
      name,
      originalLabel,
      cents: euros * 100,
      category: category.id,
      sourcePage: 10,
    }),
  ),
);
export const reportExample = ["gyros", "potatoes", "diavasi", "wine"];
export const reportUrl =
  "https://ihuedu-my.sharepoint.com/:b:/g/personal/it185400_ihu365_gr/ERGVPwNJLQpAt2bbJ4wzC7MB2WrlryYPFJBSHldFXm1t7Q?e=1yXq78";
