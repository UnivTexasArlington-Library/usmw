<?php

//helper functions




function db_access_get_nid_by_content_id($id)
{
    $query = new EntityFieldQuery();
    
    $query->entityCondition('entity_type', 'node');
    $query->entityCondition('bundle', 'usmw_content');
    $query->fieldCondition('field_content_id', 'value', (int)$id, '=');
    
    $result = $query->execute();
    
    //echo json_encode($result);
    
    if(isset ($result['node']))
    {
        //echo json_encode($result);
        
        $nids = array_keys($result['node']);
        
        return $nids[0];
        
    }
    
    
    return null;
    
}

function db_access_get_nid_by_bio_id($id)
{
    $query = new EntityFieldQuery();
    
    $query->entityCondition('entity_type', 'node');
    $query->entityCondition('bundle', 'usmw_bio');
    $query->fieldCondition('field_bio_id', 'value', (int)$id, '=');
    
    $result = $query->execute();
    
    //echo json_encode($result);
    
    if(isset ($result['node']))
    {
        //echo json_encode($result);
        
        $nids = array_keys($result['node']);
        
        return $nids[0];
        
    }
    
    
    return null;
    
}


function db_access_get_bios_by_nation($nation)
{
    $query = new EntityFieldQuery();
    
    $query->entityCondition('entity_type', 'node');
    $query->entityCondition('bundle', 'usmw_bio');
    $query->fieldCondition('field_bio_nationality', 'value', $nation, '=');
    
    $result = $query->execute();
    
    //echo json_encode($result);
    
    if(isset ($result['node']))
    {
        //echo json_encode($result);
        
        $nids = array_keys($result['node']);
        
        return $nids;
        
    }
    
    
    return null;
    
}

function db_access_get_nid_by_topic_id($id)
{
    $query = new EntityFieldQuery();
    
    $query->entityCondition('entity_type', 'node');
    $query->entityCondition('bundle', 'usmw_topic');
    $query->fieldCondition('field_topic_id', 'value', (int)$id, '=');
    
    $result = $query->execute();
    
    //echo json_encode($result);
    
    if(isset ($result['node']))
    {
        //echo json_encode($result);
        
        $nids = array_keys($result['node']);
        
        return $nids[0];
        
    }
    
    
    return null;
    
}

//multiple version
function db_access_get_nid_by_topic_ids($ids)
{
    $query = new EntityFieldQuery();
    
    $query->entityCondition('entity_type', 'node');
    $query->entityCondition('bundle', 'usmw_topic');
    $query->fieldCondition('field_topic_id', 'value', $ids);
    
    $result = $query->execute();
    
    //echo '<br> ' . json_encode($result);
    
    if(isset ($result['node']))
    {
        //echo json_encode($result);
        
        $nids = array_keys($result['node']);
        
        //echo '<br> ' . json_encode($nids);
        
        return $nids;
        
    }
    
    
    return null;
    
}


function db_access_get_nids_by_formats($format_ids)
{

    $query = new EntityFieldQuery();
    
    $query->entityCondition('entity_type', 'node');
    $query->entityCondition('bundle', 'usmw_content');
    $query->fieldCondition('field_format_id', 'value', $format_ids);
    
    
    $result = $query->execute();
    
    //echo '<br> ' . json_encode($result);
    
    if(isset ($result['node']))
    {
        //echo json_encode($result);
        
        $nids = array_keys($result['node']);
        
        //echo '<br> ' . json_encode($nids);
        
        return $nids;
        
    }
    
    
    return null;
    
}


function db_access_get_topics_lists_by_nids($nids)
{
    
    $search1 = 'SELECT entity_id, field_content_topics_list_value FROM field_data_field_content_topics_list where ';
    $count = 0;
    
    $lists = [];
    
    forEach($nids as $nid)
    {
    
        if($count > 0)
        {
            $search1 .= ' OR ';
        }
        
        $search1 .= "entity_id = '" . $nid . "'";
        
        $count++;
    }
    
    $results = db_query($search1);
    
    forEach($results as $row)
    {
        
        
        $list = new stdClass();
        
        $list->nid = $row->entity_id;
        $list->topic_list = $row->field_content_topics_list_value;
        
        array_push($lists, $list);
        
        $count++;
 
    }
    
    return $lists;
    
    
}


function db_access_get_content_by_format_id($id)
{
    $query = new EntityFieldQuery();
    
    $query->entityCondition('entity_type', 'node');
    $query->entityCondition('bundle', 'usmw_content');
    $query->fieldCondition('field_format_id', 'value', (int)$id, '=');
    
    $result = $query->execute();
    
    //echo json_encode($result);
    
    
    if(isset ($result['node']))
    {
        //echo json_encode($result);
        
        $nids = array_keys($result['node']);
        
        return $nids;
        
    }
    
    return null;
    
    
}


/*
function db_access_get_format_topic_content($topic_id, $format_id)
{
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node');
    $query->entityCondition('bundle', 'usmw_content');
    $query->fieldCondition('field_format_id', 'value', (int)$format_id, '=');
    
    
    $result = $query->execute();
    
    
    if(isset ($result['node']))
    {
        //echo json_encode($result);
        
        $nids = array_keys($result['node']);
        
        return $nids;
        
    }
    
    return null;
}
*/




function load_topics_from_list($l) //comma seperated string
{
    $list = explode(",", $l);
    
    $ids = [];
    
    if(count($list) > 0)
    {
        forEach($list as $t)
        {
            $t = trim($t);
            if(strlen($t) > 0)
            {
                array_push($ids, (int)$t);
                
            }
        
        }
        
        //echo 'topic list  ' . json_encode($ids);
        
        $nids = db_access_get_nid_by_topic_ids($ids);
        //$nids = [34,36];
        //echo '<br>nids  ' . json_encode($nids);
        
        return node_load_multiple($nids);
        
    }
    
    return null;
    
}



//cumbersome but quickest way to get topics names..(rather than fully loading nodes)
function get_topic_titles_from_list($l)
{
    $list = explode(",", $l);
    $ids = [];
    
    $titles = [];
    
    if(count($list) > 0)
    {
        forEach($list as $t)
        {
            $t = trim($t);
            if(strlen($t) > 0)
            {
                array_push($ids, (int)$t);
                
            }
        
        }
        
        $search1 = 'SELECT field_topic_id_value, entity_id FROM field_data_field_topic_id where ';
        
        $count = 0;
        
        forEach($ids as $id)
        {
        
            if($count > 0)
            {
                $search1 .= ' OR ';
            }
            
            $search1 .= "field_topic_id_value = '" . $id . "'";
            
            
        
            $count++;
        }
        
        
        //echo '<br> ' . $search1 . ' <br>';
        
    }
    
    
    //using db_query to avoid fully loading many nodes just for the title
   
    $results1 = db_query($search1);
    
    
    $search2 = 'SELECT field_topic_name_value, entity_id FROM field_data_field_topic_name where ';
    
    $count = 0;
    
    forEach($results1 as $row)
    {
        
        if($count > 0)
        {
            $search2 .= ' OR ';
        }
        
        $search2 .= "entity_id = '" . $row->entity_id . "'";
        
        
        
        $title = new stdClass();
                
        $title->nid = $row->entity_id;
        $title->topic_id = $row->field_topic_id_value;
        
        array_push($titles, $title);
        
        
        $count++;
         
    }
    
    $results2 = db_query($search2);
    
    
    forEach($results2 as $row)
    {
        
        forEach($titles as $title)
        {
            if($title->nid === $row->entity_id)
            {
            
                $title->title = $row->field_topic_name_value;
            }
            
        }
        
        
    }
    
    
    //echo '<br>' . json_encode($titles);
    
    return $titles;
    
    //return 'test';
    

}


function db_access_list_to_ids($l)
{
    $list = explode(",", $l);
    $ids = [];
    
    $titles = [];
    
    if(count($list) > 0)
    {
        forEach($list as $t)
        {
            $t = trim($t);
            if(strlen($t) > 0)
            {
                array_push($ids, (int)$t);
                
            }
        
        }
        
    }
    
    
    return $ids;
    
}

function db_access_is_id_in_list($l, $id)
{
    $id = (int)$id;
    $ids = db_access_list_to_ids($l);

    forEach($ids as $_id)
    {
        if($_id === $id)
        {
        
            return true;
        
        }
    }
    
    return false;
}



function db_access_get_related_content_by_topic_id($topic_id)
{
    $query = 'SELECT entity_id, field_content_topics_list_value FROM field_data_field_content_topics_list';
    
    $results = db_query($query);
    
    $contents = [];
    
    forEach($results as $row)
    {
        if(strpos($row->field_content_topics_list_value, (string)$topic_id) !== false) {
        
                //todo check for exact matches
                
                if(db_access_is_id_in_list($row->field_content_topics_list_value, $topic_id))
                {
                
                    $c = new stdClass();
                    $c->nid = $row->entity_id;
                    $c->topics_list = $row->field_content_topics_list_value;
                    
                    
                    
                    array_push($contents, $c);
                    
                }
                
        }
        
        
    }
    
    //go ahead and get the format as well
    
    $query2 = 'SELECT entity_id, field_format_id_value FROM field_data_field_format_id';
    
    $results2 = db_query($query2);
    forEach($results2 as $row)
    {
        forEach($contents as $c)
        {
            if($c->nid === $row->entity_id)
            {
                $c->format_id = $row->field_format_id_value;
                //echo '<br>' . json_encode($c);
            }
        
        
        }
    
    }
    
    
    
    return $contents;
    
}



function db_access_get_related_bios_by_topic_id($topic_id)
{

    
    
    $query = 'SELECT entity_id, field_bio_topic_list_value FROM field_data_field_bio_topic_list';
    
    $results = db_query($query);
    
    $bios = [];
    
    
    
    forEach($results as $row)
    {
        if(strpos($row->field_bio_topic_list_value, (string)$topic_id) !== false) {
        
                //todo check for exact matches
                
                if(db_access_is_id_in_list($row->field_bio_topic_list_value, $topic_id))
                {
                
                    $b = new stdClass();
                    $b->nid = $row->entity_id;
                    $b->topics_list = $row->field_bio_topic_list_value;
                    
                    
                    
                    array_push($bios, $b);
                    
                }
                
        }
        
        
    }
    
    
    //get the bio_id as well
    
    $query2 = 'SELECT entity_id, field_bio_id_value FROM field_data_field_bio_id';
    
    
    $results2 = db_query($query2);
    forEach($results2 as $row)
    {
        forEach($bios as $b)
        {
            if($b->nid === $row->entity_id)
            {
                $b->bio_id = $row->field_bio_id_value;
                
            }
        
        
        }
    
    }
    
    
    
    return $bios;
    
}



function db_access_usmw_search($terms)
{
    //$terms = preg_replace("([^a-zA-z])","",$terms); // original
    $terms = trim($terms);
    $terms = preg_replace('/[^\da-z]/i', ' ', $terms);
    //echo '<br>filtered ' . $terms;
    
    
    $content_query1 = "SELECT entity_id FROM field_data_field_content_title WHERE (upper(field_content_title_value LIKE '%".$terms."%'))";
    $results1 = db_query($content_query1);
    
    $content_query2 = "SELECT entity_id FROM field_data_field_content_description WHERE (upper(field_content_description_value LIKE '%".$terms."%'))";
    $results2 = db_query($content_query2);
    
    $content_query3 = "SELECT entity_id FROM field_data_field_content_translated_title WHERE (upper(field_content_translated_title_value LIKE '%".$terms."%'))";
    $results3 = db_query($content_query3);
    
    $content_query4 = "SELECT entity_id FROM field_data_field_content_creator WHERE (upper(field_content_creator_value LIKE '%".$terms."%'))";
    $results4 = db_query($content_query4);
    
    $content_query5 = "SELECT entity_id FROM field_data_field_content_publisher WHERE (upper(field_content_publisher_value LIKE '%".$terms."%'))";
    $results5 = db_query($content_query5);
    
    $content_query6 = "SELECT entity_id FROM field_data_field_content_pub_place WHERE (upper(field_content_pub_place_value LIKE '%".$terms."%'))";
    $results6 = db_query($content_query6);
    
    $content_query7 = "SELECT entity_id FROM field_data_field_content_image_identifier WHERE (upper(field_content_image_identifier_value LIKE '%".$terms."%'))";
    $results7 = db_query($content_query7);
    
    
    $content_results = [$results1, $results2, $results3, $results4, $results5, $results6, $results7];
    $content_nids = db_access_merge_entity_ids($content_results);
    
    
    $topic_query1 = "SELECT entity_id FROM field_data_field_topic_name WHERE (upper(field_topic_name_value LIKE '%".$terms."%'))";
    $topic_results1 = db_query($topic_query1);
    
    $topic_query2 = "SELECT entity_id FROM field_data_field_topic_description WHERE (upper(field_topic_description_value LIKE '%".$terms."%'))";
    $topic_results2 = db_query($topic_query2);
    
    $topic_results = [$topic_results1, $topic_results2];
    $topic_nids = db_access_merge_entity_ids($topic_results);
    
    $bio_query1 = "SELECT entity_id, field_bio_forename_value FROM field_data_field_bio_forename WHERE (upper(field_bio_forename_value LIKE '%".$terms."%'))";
    $bio_results1 = db_query($bio_query1);
    
    $bio_query2 = "SELECT entity_id, field_bio_surname_value FROM field_data_field_bio_surname WHERE (upper(field_bio_surname_value LIKE '%".$terms."%'))";
    $bio_results2 = db_query($bio_query2);
    
    $bio_results = [$bio_results1, $bio_results2];
    $bio_nids = db_access_merge_entity_ids($bio_results);
    
    
    $usmw_search = new stdClass();
    $usmw_search->terms = $terms;
    $usmw_search->content_nids = $content_nids;
    $usmw_search->topic_nids = $topic_nids;
    $usmw_search->bio_nids = $bio_nids;
    
    return $usmw_search;

}


function db_access_merge_entity_ids($searches)
{
    $nids = [];
    
    forEach($searches as $results)
    {
        forEach($results as $row)
        {
            if(!in_array($row->entity_id, $nids))
            {
                array_push($nids, $row->entity_id);
            }
        }
    }

    return $nids;
}

//use parameterized queries for security
//notes: https://www.drupal.org/docs/7/security/writing-secure-code/database-access


//original site searches
// content: content_title, content_description, content_translated_title, content_creator, content_contributor, content_publisher, content_pub_place, content_image_identifier, 
// topic: name, description
// bio: bio_forename, bio_surname



//reference queries from original code (mainsearch.php)

//main query for searching content table

/*
if ($sort == 'asc') {
$data = $db_con->query("SELECT formats.format_id, format_name, content_title, content_id, content_thumbnail, content_translated_title, content_image_url FROM contents, formats WHERE formats.format_id = contents.format_id AND ((upper(content_title) LIKE '%".$search."%') OR (upper(content_description) LIKE '%".$search."%') OR (upper(content_translated_title) LIKE '%".$search."%') OR (upper(content_creator) LIKE '%".$search."%') OR (upper(content_contributor) LIKE '%".$search."%') OR (upper(content_publisher) LIKE '%".$search."%') OR (upper(content_pub_place) LIKE '%".$search."%') OR (upper(content_image_identifier) LIKE '%".$search."%')) ORDER BY contents.format_id ASC, TRIM(LEADING 'a ' FROM TRIM(LEADING 'an ' FROM TRIM(LEADING 'the ' FROM TRIM(LEADING 'el ' FROM LOWER(content_title))))) ASC");
}
elseif ($sort == 'desc') {
$data = $db_con->query("SELECT formats.format_id, format_name, content_title, content_id, content_thumbnail, content_translated_title, content_image_url FROM contents, formats WHERE formats.format_id = contents.format_id AND ((upper(content_title) LIKE '%".$search."%') OR (upper(content_description) LIKE '%".$search."%') OR (upper(content_translated_title) LIKE '%".$search."%') OR (upper(content_creator) LIKE '%".$search."%') OR (upper(content_contributor) LIKE '%".$search."%') OR (upper(content_publisher) LIKE '%".$search."%') OR (upper(content_pub_place) LIKE '%".$search."%') OR (upper(content_image_identifier) LIKE '%".$search."%')) ORDER BY contents.format_id ASC, TRIM(LEADING 'a ' FROM TRIM(LEADING 'an ' FROM TRIM(LEADING 'the ' FROM TRIM(LEADING 'el ' FROM LOWER(content_title))))) DESC");
}
else {
$data = $db_con->query("SELECT formats.format_id, format_name, content_title, content_id, content_thumbnail, content_translated_title, content_image_url FROM contents, formats WHERE formats.format_id = contents.format_id AND ((upper(content_title) LIKE '%".$search."%') OR (upper(content_description) LIKE '%".$search."%') OR (upper(content_translated_title) LIKE '%".$search."%') OR (upper(content_creator) LIKE '%".$search."%') OR (upper(content_contributor) LIKE '%".$search."%') OR (upper(content_publisher) LIKE '%".$search."%') OR (upper(content_pub_place) LIKE '%".$search."%') OR (upper(content_image_identifier) LIKE '%".$search."%')) ORDER BY contents.format_id ASC, TRIM(LEADING 'a ' FROM TRIM(LEADING 'an ' FROM TRIM(LEADING 'the ' FROM TRIM(LEADING 'el ' FROM LOWER(content_title))))) ASC");
}

//query for search biography tables
$data3 = $db_con->query("SELECT bio_id, bio_forename, bio_surname, bio_thumbnail, bio_image_url FROM biographies WHERE (upper(bio_forename LIKE '%".$search."%') OR (upper(bio_surname) LIKE '%".$search."%')) ORDER BY bio_surname ASC");


//query for search module descriptions and names
$data4 = $db_con->query("SELECT topics.topic_id, topic_name, topic_description, topic_thumbnail, topic_image_url FROM topics WHERE (upper(topic_name LIKE '%".$search."%') OR (upper(topic_description LIKE '%".$search."%'))) ORDER BY topic_name ASC");


*/

