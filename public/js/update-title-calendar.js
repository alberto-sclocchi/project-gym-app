document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("edit-button").onclick = function(){
        document.getElementById("title-div").style.display = "none";
        document.getElementById("change-title-div").style.display = "block";
    }

    function restoreDOM(){
        document.getElementById("change-title-div").style.display = "none";
        document.getElementById("title-div").style.display = "block";
    }

    document.getElementById("cancel-edit-button").onclick = function(){
        restoreDOM();
    }

    document.getElementById("confirm-edit-button").onclick = async () => {
        const newTitle = document.querySelector("#input-calendar input").value;
        const id = document.getElementById("input-calendar").dataset.id;

        const update = await axios.post(`/calendars/edit/title/${id}`, {title: newTitle});
        restoreDOM();

        document.getElementById("span-title").innerText = update.data.title;


    }
});
  