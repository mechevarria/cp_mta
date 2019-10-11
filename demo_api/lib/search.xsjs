/*eslint quotes: ["error", "single"]*/
/*eslint-env es6 */
const searchQuery = `
	SELECT event_id,
       event_date,
       event_type,
       actor_1,
       actor_2,
       country_name,
       fatalities,
       geo_location.ST_ASWKT(),
       highlighted(notes)
	FROM event
	WHERE contains(notes, ?, Fuzzy(0.8))
`;
const search = $.request.parameters.get('search') || '';

const conn = $.hdb.getConnection();

$.response.contentType = 'application/json';
try {
	const results = conn.executeQuery(searchQuery, search);

	$.response.setBody(JSON.stringify({
		'results': results,
		'count': results.length
	}));
	$.response.status = $.net.http.OK;
} catch (e) {
	$.response.setBody(JSON.stringify({
		'error': e.message
	}));
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}

conn.close();