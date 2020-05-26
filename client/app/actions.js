const saveStudent = (studentObj) => {
    fetch('/api/students/', {
        method: 'POST',
        body: JSON.stringify(studentObj),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((res) => {
            if (res.status === 400 || res.status === 404)
                return res.json();
            else
                alert('Your changes have been made !')

        })
        .then((message) => {
            const errorText = JSON.stringify(message);
            if (errorText)
                throw errorText;
            location.reload();

        })
        .catch(ex => {
            console.error(ex);
            alert('unable to save your changes , Schema error... ' + ex);
        });
}
const updateStudent = (studentObj) => {
    fetch('/api/students/' + studentObj.id, {
        method: 'PUT',
        body: JSON.stringify(studentObj),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((res) => {
            if (res.status === 400 || res.status === 404)
                return res.json();
            else
                alert('Your changes have been made !')

        })
        .then((message) => {
            const errorText = JSON.stringify(message);
            if (errorText)
                throw errorText;
            location.reload();

        })
        .catch(ex => {
            console.error(ex);
            alert('unable to save your changes' + ex);
        });
}
const deleteStudent = (id) => {
    fetch('/api/students/' + id, {
        method: 'DELETE',
    })
        .then((res) => {
            if (res.status === 400 || res.status === 404)
                return res.json();
            else
                alert('Your deletion have been made !')

        })
        .then((message) => {
            const errorText = JSON.stringify(message);
            if (errorText) {
                alert(errorText);
                throw errorText;
            }
            location.reload();

        })
        .catch(ex => {
            console.error(ex);
            alert('unable to save your changes ' + ex);
        });
}