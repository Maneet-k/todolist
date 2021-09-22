exports.getDate= function(){let d = new Date();
let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
};
return d.toLocaleDateString("en-US", options);
}
console.log(exports);