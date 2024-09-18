const slugify = require("slugify");

const updateData = (databaseData, formData) => {
  for (const [key, value] of Object.entries(formData)) {
    // If "title" is changed, update the slug
    if (key === "title" && value !== databaseData.title) {
      databaseData.slug = slugify(value, { lower: true }).replace(
        /[^\w\-]+/g,
        ""
      );
    }
    // Update the value if the value is changed
    if (value !== databaseData[key]) {
      databaseData[key] = value;
    }
  }

  return databaseData;
};

module.exports = updateData;
