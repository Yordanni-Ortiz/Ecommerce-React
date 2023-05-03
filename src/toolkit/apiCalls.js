import axios from "axios";

function apiBase({
    method,
    url,
    data,
    resolve,
    reject,
    $finally
})
{
    return () => axios({
        method,
	url,
	data
    })
    .then(res => resolve(res?.data))
    .catch(err => reject(err))
    .finally($finally());
}

export function apiGet({
    id = "",
    url,
    resolve,
    reject,
    $finally = () => {}
})
{
    return apiBase({
        method: "get",
	url: url + id,
	data: null,
	resolve,
	reject,
	$finally
    });
}

export function apiCreate(
    url,
    data,
    resolve,
    reject,
    $finally
)
{
    return apiBase({
        method: "post",
	url,
	data,
	resolve,
	reject,
	$finally
    });
}

export function apiUpdate(
    id,
    url,
    data,
    resolve,
    reject,
    $finally
)
{
    return apiBase({
        method: "put",
	url: url + id,
	data,
	resolve,
	reject,
	$finally
    });
}

export function apiDelete(
    id,
    url,
    resolve,
    reject,
    $finally
)
{
    return apiBase({
        method: "delete",
        url: url + id,
	data: null,
	resolve,
	reject,
	$finally
    });
}

export default function apiCalls({
    type = "get",
    id = "",
    url,
    data = null,
    resolve,
    reject,
    $finally = () => {}
})
{
    switch(type)
    {
	case "get":
	    return apiGet({
                id,
		url,
		resolve,
		reject,
		$finally
	    })();
	case "create":
	    return apiCreate(
	        url,
		data,
		resolve,
		reject,
		$finally
	    )();
	case "update":
	    return apiUpdate(
                id,
		url,
		data,
		resolve,
		reject,
		$finally
	    )();
	case "delete":
	    return apiDelete(
                id,
		url,
		resolve,
		reject,
		$finally
	    )();
	default:
	    console.log(`This "${type}" operation is wrong! The allowed operations are: [get, create, update, delete]`);
            return null;
    }
}
