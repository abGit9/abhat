import os
import io
import numpy as np
import sqlite3
import pandas as pd
import urllib.request, json

from google.cloud import vision
import google.auth

from flask import Flask
from flask_cors import CORS
app = Flask(__name__)

CORS(app, resources={r"*": {"origins": "https://abhat.io"}})
#CORS(app)
cursor_Meds_Db=''
connect_db = ''



@app.route('/')
def default():  
	print ('default method')
	return 'Med Lable Reader'


def detect_text_custom_remote(image_data):	
	
	credentials, project = google.auth.default()	
	
	client = vision.ImageAnnotatorClient(credentials=credentials)
	image = vision.Image(content=image_data)
	
	response = client.text_detection(image=image)
	texts = response.text_annotations
	
	txtArray= np.empty([0], dtype=str)

	boundsArray =  np.empty([0,8], dtype=int)
	itemboundsArray= np.empty([1,8], dtype=int) 
	
	for text in texts:		

		vertices = (['({},{})'.format(vertex.x, vertex.y)
                    for vertex in text.bounding_poly.vertices])		
		
		coord0Str= vertices[0]
		coord1Str= vertices[1]
		coord2Str= vertices[2]
		coord3Str= vertices[3]			
		
		index0 = coord0Str.find(',')
		index1 = coord1Str.find(',')
		index2 = coord2Str.find(',')
		index3 = coord3Str.find(',')
		
		itemboundsArray[0,0]= int(coord0Str[1:index0])
		itemboundsArray[0,1]=int(coord0Str[index0+1:-1])
		
		itemboundsArray[0,2]=int(coord1Str[1:index1])
		itemboundsArray[0,3]=int(coord1Str[index1+1:-1])
		
		itemboundsArray[0,4]=int(coord2Str[1:index2])
		itemboundsArray[0,5]=int(coord2Str[index2+1:-1])
		
		itemboundsArray[0,6]=int(coord3Str[1:index3])
		itemboundsArray[0,7]=int(coord3Str[index3+1:-1])	
		
		boundsArray = np.append(boundsArray,itemboundsArray,axis = 0)
		txtArray = np.append(txtArray,[text.description],axis = 0)	
	
	return txtArray,boundsArray
	

def detect_text_custom_local(path):	
	
	credentials, project = google.auth.default()	
	
	client = vision.ImageAnnotatorClient(credentials=credentials)	
	
	with io.open(path, 'rb') as image_file:
		content = image_file.read()

	image = vision.Image(content = content)

	response = client.text_detection(image = image)
	texts = response.text_annotations
	
	txtArray= np.empty([0], dtype=str)

	boundsArray =  np.empty([0,8], dtype=int)
	itemboundsArray= np.empty([1,8], dtype=int) 
	
	for text in texts:		

		vertices = (['({},{})'.format(vertex.x, vertex.y)
                    for vertex in text.bounding_poly.vertices])	
	
		
		coord0Str= vertices[0]
		coord1Str= vertices[1]
		coord2Str= vertices[2]
		coord3Str= vertices[3]			
		
		index0 = coord0Str.find(',')
		index1 = coord1Str.find(',')
		index2 = coord2Str.find(',')
		index3 = coord3Str.find(',')
		
		itemboundsArray[0,0]= int(coord0Str[1:index0])
		itemboundsArray[0,1]=int(coord0Str[index0+1:-1])
		
		itemboundsArray[0,2]=int(coord1Str[1:index1])
		itemboundsArray[0,3]=int(coord1Str[index1+1:-1])
		
		itemboundsArray[0,4]=int(coord2Str[1:index2])
		itemboundsArray[0,5]=int(coord2Str[index2+1:-1])
		
		itemboundsArray[0,6]=int(coord3Str[1:index3])
		itemboundsArray[0,7]=int(coord3Str[index3+1:-1])
		
	
		
		boundsArray = np.append(boundsArray,itemboundsArray,axis = 0)
		txtArray = np.append(txtArray,[text.description],axis = 0)	
		
	
	
	return txtArray,boundsArray
	
cursor_Meds_Db=''
connect_db = ''
def open_meds_db():
	global connect_db
	global cursor_Meds_Db
	connect_db = sqlite3.connect('Meds_1.db')	
	cursor_Meds_Db = connect_db.cursor()
	resTableSUMM = cursor_Meds_Db.execute("SELECT sql FROM sqlite_master WHERE type = 'table' AND tbl_name = 'Meds1a'")
	lengthResultes=cursor_Meds_Db.execute("SELECT * FROM Meds1a").fetchall()
	
	
def close_meds_db():	
	connect_db.close()

def parse_ndc_number(texts):
	title='none'
	ndc_string = 'ndc'
	dash_string ='-'
	lowercaseTxt=''
	ndcNotePresent = False	
	ndc_Number=''
	for txt in texts[1:]:
		
		lowercaseTxt = txt.lower()
		if ndc_string in lowercaseTxt:
			ndcNotePresent=True	
			break
	
	
	if ndcNotePresent==True:
		for txt in texts[1:]:
	
			if (any(char.isdigit() for char in txt)) and  (txt.count('-')==2):
			
				#CHECKING TO SEE IF NDC NUMBER WORKS 				
				
				baseUrl=  'https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?ndc='					
				
				urlresponse= urllib.request.urlopen(baseUrl+txt)
				urlJson = json.loads(urlresponse.read())
				
				dataListLength= len(urlJson['data'])
				
				if (dataListLength==0):					
					ndcNotePresent=False
					break					
				else:
					ndcNotePresent=True
				
				for each in urlJson['data']:
					title = each['title']					

				ndc_Number=txt
				break
			else:
				
				ndcNotePresent=False
	
	
	return ndcNotePresent,title,ndc_Number
				
def asses_label_txt_for_NDC(textArray):
	ndcNotePresent,title,ndc_Number = parse_ndc_number(textArray)		
		
	return ndcNotePresent,title,ndc_Number




def find_titleB(txtArray,txtBoundsArray):	
	
	heightArray = np.array(txtBoundsArray[:,8])
	found_proper_txt =False	
	
	add_txt= False
	best_length= 0
	while (not found_proper_txt):
		found_proper_txt=True	
		indexMax = np.argmax(heightArray) 
		
		
		if (add_txt==False):
			txt_to_query= "'%"+txtArray[indexMax]+"%'"			
		else:
			txt_to_query = txt_to_query+txtArray[indexMax]+'%'
	
		if (txt_to_query.isnumeric()):
			found_proper_txt=False
		else:
		#	query_txt = "'%"+txt_to_query+"%'"
			#NEED TO DECIDE BETWEEN QUERYING FOR TITLE OR PRODUCT NAME FORM			
			
			#result_array = query_string(txt_to_query,'product_name_form')			
			result_array = query_string(txt_to_query,'title')							
	
			length = len(result_array)
			if (length>1000 or length ==0):					
				found_proper_txt=False
			elif (length>300):
				found_proper_txt=False
				add_txt=True
				best_length=length
				
			
		
		if (not found_proper_txt):
			heightArray[indexMax]=0	
	

	
	exit()
	return result_array,indexMax
def find_title3(txtArray,txtBoundsArray):
	
	
	heightArray = np.array(txtBoundsArray[:,8])
	found_proper_txt =False	
	
	while (not found_proper_txt):
		found_proper_txt=True	
		indexMax = np.argmax(heightArray) 
		
		txt_to_query= txtArray[indexMax]
		if (txt_to_query.isnumeric()):
			found_proper_txt=False
		else:
			query_txt = "'%"+txt_to_query+"%'"					
			#NEED TO DECIDE BETWEEN QUERYING FOR TITLE OR PRODUCT NAME FORM			
			
			#result_array = query_string(query_txt,'product_name_form')			
			result_array = query_string(query_txt,'title')							
	
			length = len(result_array)
		
			if (length>200 or length ==0):					
				found_proper_txt=False		
		
		if (not found_proper_txt):
			heightArray[indexMax]=0	
	
	
	return result_array,indexMax	



#keep this list in alphabetical order
common_words_list = ['and','company','for','in','inc','ing','llc','of','per','pharma','the','to']



def matching_company_names2(txtArray,result_array):
	print('matching_company_names--------------')
	result_array_company_filtered = np.empty((0,result_array.shape[1]),dtype='str')
	company_names= result_array[:,5]
	
	for index, each in enumerate(company_names):
		eachString_lc=each.lower()	
		present=False			
		
		for eachTxt in txtArray:					
			eachTxt_lc =eachTxt.lower()					
			if (eachTxt_lc.isnumeric( ) == True):
				continue
			elif (eachTxt_lc in common_words_list):				
				continue
			elif(len(eachTxt_lc)<=2):
				continue
			elif ((eachTxt_lc in eachString_lc )or (eachString_lc in eachTxt_lc )):			
				present=True				
				break			
			
		if (present==True):
			result_array_company_filtered = np.append(result_array_company_filtered,[result_array[index,:]],axis=0)
						
	return result_array_company_filtered
		




	
def matching_img_txt_to_title(txtArray,result_array, startIndxTxt, endIndxTxt):
	
	best_array=result_array	
	best_length = len(best_array)
	
	
	for index_t, txt in enumerate(txtArray[startIndxTxt:endIndxTxt]):	
		
		new_array=np.empty((0,best_array.shape[1]),dtype='int')			
		txt_lc=txt.lower()
		if (txt_lc in common_words_list):				
				continue
		match=0
		for index, row in enumerate(best_array):
			title_lc=row[1].lower()			
			
			if (txt_lc in title_lc) :					
				match+=1
				new_array = np.append(new_array,[row],axis =0)
			
		if (0<len(new_array)<best_length):			
			best_array=new_array
			best_length=len(new_array)			
			
			if (best_length==1):				
				break		
	
	return  best_array



def find_title_flipped_B(txtArray,best_array):
	
	titles = best_array[:,1]
	
	title_array= remove_non_alpha_numerica_characters(titles)
	
	
	
	modified_title_array=insert_spaces_into_strings_with_gaps(title_array)
	
	
	
	scores_array = np.empty(modified_title_array.shape,dtype='float')
	
	for index_scores, each in enumerate( modified_title_array):	
		list_strings = each.split()	
		txt_match_array = np.empty((len(list_strings),1),dtype='bool')
		for index, each_string in enumerate( list_strings):
			present =False		
			each_str_lc= each_string.lower()
			
			for eachTxt in txtArray:			
				eachTxt_lc= eachTxt.lower()
				
				if (each_str_lc in eachTxt_lc) or (eachTxt_lc in each_str_lc):
				
					present=True					
					break
					
			if (present == True):
				txt_match_array[index]=True
			else :
				txt_match_array[index]=False
		
		
	
		count_true=0
		for each in txt_match_array:
			if (each==True):
				count_true+=1	
		

		
		score = count_true/len(txt_match_array)		
		scores_array[index_scores]=score
	
	
	indexMax = np.argmax(scores_array)
	
	
	
	maximum_score = scores_array[indexMax]
	
	range_inclusive_below_max = 0.08
	return_array = np. empty((0,best_array.shape[1]),dtype='str')
	
	for index, each in enumerate(scores_array):		
		difference = maximum_score-each				
		if difference<=range_inclusive_below_max:			
			return_array= np.append(return_array,[best_array[index,:]],axis=0)		
	
	return return_array


def find_title_flipped(txtArray,best_array):
	
	titles = best_array[:,1]	
	title_array= remove_non_alpha_numerica_characters(titles)	
	modified_title_array=insert_spaces_into_strings_with_gaps(title_array)	
	
	scores_array = np.empty(modified_title_array.shape,dtype='float')
	
	for index_scores, each in enumerate( modified_title_array):	
		list_strings = each.split()	
		txt_match_array = np.empty((len(list_strings),1),dtype='bool')
		for index, each_string in enumerate( list_strings):
			present =False		
			each_str_lc= each_string.lower()
			
			for eachTxt in txtArray:			
				eachTxt_lc= eachTxt.lower()
				
				if (each_str_lc in eachTxt_lc) or (eachTxt_lc in each_str_lc):					
					present=True					
					break
					
			if (present == True):
				txt_match_array[index]=True
			else :
				txt_match_array[index]=False	
		
	
		count_true=0
		for each in txt_match_array:
			if (each==True):
				count_true+=1	

		
		score = count_true/len(txt_match_array)
		scores_array[index_scores]=score
	
	indexMax = np.argmax(scores_array)
	
	####Have to decide how many to return based on score	
	return best_array[indexMax,:]	

def query_string(queryString,whereString):

	
	entireString = "SELECT rowid,title,setid,product_name_form, product_name_generic,company FROM Meds1a WHERE "+whereString+" LIKE "+queryString
	#entireString = "SELECT product_name_form FROM Meds1a WHERE "+whereString+" LIKE "+queryString
	
	results=cursor_Meds_Db.execute(entireString)
	
	a= results.fetchall()	
	array = np.asarray(a) 
	
	
	return array



def calculate_height_txt_bounds (txtBoundsArray):
	
	columnHeights = np.zeros((len(txtBoundsArray),1),dtype='int')
	for index, row in enumerate(txtBoundsArray):	
		height = row[7]-row[1]
		columnHeights[index]=height
		
	txtBoundsArray = np.append(txtBoundsArray,columnHeights,axis =1)
		
	return txtBoundsArray		
		
def remove_non_alpha_numerica_characters(string_array):		
		
	modified_string_array=string_array	
	

	for index, each in enumerate(string_array):	
		if (not each.isalnum()):				
			for char in each:
				if char == ' ':
					continue
				elif not char.isalnum() :				
					modified_string_array[index] = modified_string_array[index].replace(char,'_')		
					
	
	return modified_string_array		

def remove_empty_items_from_string_array(txtArray,txtBoundArray):	
	arrayOfIndexestoRemove=np.empty((0),dtype='int')	
	for index,each in enumerate(txtArray):		
		remove=True		
		for char in each:
			if (char!=' ') and (char!='_') :			
				remove=False	
				break	
		if (remove==True):			
			arrayOfIndexestoRemove = np.append(arrayOfIndexestoRemove,[index],axis=0)	

	modifiedTxtArray = np.delete(txtArray,arrayOfIndexestoRemove,axis=0)
	modifiedtxtBoundArray= np.delete(txtBoundArray,arrayOfIndexestoRemove,axis=0)	
	
	return modifiedTxtArray,modifiedtxtBoundArray
	

	
def asses_label_txt_controller(textArray, textBoundsArray):
	
	text_Array_each_word = textArray[1:]
	text_BOUNDS_each_word  = textBoundsArray[1:,:]		

	alpha_numeric_txt_array = remove_non_alpha_numerica_characters(text_Array_each_word)	

	alpha_numeric_txt_array_2,txt_bounds=remove_empty_items_from_string_array(alpha_numeric_txt_array,text_BOUNDS_each_word)
	
	
	txt_bounds_w_height = calculate_height_txt_bounds (txt_bounds)	

	
	txt_stripped = alpha_numeric_txt_array_2
	for index, each in enumerate(alpha_numeric_txt_array_2):
		txt_stripped[index]=alpha_numeric_txt_array_2[index].strip('_')

	
	##############Database querying/matching ######################################################	
	

	result_array,indexMax= find_title3(txt_stripped,txt_bounds_w_height)

	
	txt_w_spaces= insert_spaces_into_strings_with_gaps(txt_stripped)	
	

	length_result_array= len(result_array) 
	if (length_result_array==1):
		return result_array
	elif(length_result_array>50) :
		array_company_filtered=matching_company_names2(txt_w_spaces,result_array)	
		length_array_company_filtered=len(array_company_filtered)		
		
		if (length_array_company_filtered==1):
			return array_company_filtered
		elif (length_array_company_filtered>1):
			result_array=array_company_filtered	
	

	
	array_from_target=matching_img_txt_to_title(txt_w_spaces,result_array, indexMax+1, len(txt_w_spaces))
	length_array_from_target=len(array_from_target)

	
	
	array_from_start=matching_img_txt_to_title(txt_w_spaces,result_array, 0, indexMax)
	
	length_array_from_start=len(array_from_start)

	
	
	if (length_array_from_start<5 and length_array_from_target<5):
	#if (length_array_from_start<10 and length_array_from_target<10):
		array_total=np.concatenate((array_from_start, array_from_target), axis=0)
	
		
		array_total_unique = np.unique(array_total,axis=0)
		
		

		if (len(array_total_unique)>1):		
			returned_array=compare_product_names_to_img_txt_B(txt_w_spaces,array_total_unique)				
		else:
			returned_array=array_total_unique
			
	
	elif (length_array_from_target<=length_array_from_start):
		if (length_array_from_target==1):
			returned_array= array_from_target
		else:			
			returned_array= find_title_flipped_B(txt_w_spaces,array_from_target)
		
	elif (length_array_from_target>length_array_from_start) :
		if (length_array_from_start==1):
			returned_array=array_from_start
		else:			
			returned_array= find_title_flipped_B(txt_w_spaces,array_from_start)

	return returned_array
	

	
def insert_spaces_into_strings_with_gaps(title_array):
		
	modified_title_array=title_array
	
	for index, each in enumerate( title_array):
		modified_title_array[index]= modified_title_array[index].replace('_',' ')	

	return modified_title_array


def compare_product_names_to_img_txt_2(txt_array,best_array):
	
	new_array= np.empty((0,best_array.shape[1]),dtype='str')
	count_false_array= np.empty(len(best_array),dtype='int')
	
		
	scores_each_name= np.empty(len(best_array),dtype='float')
	
	product_names = best_array[:,3]
	
	product_names_alpha_num = remove_non_alpha_numerica_characters(product_names)	
	
	product_names_2=insert_spaces_into_strings_with_gaps(product_names_alpha_num)	
	
	
	
	split_txt_array = np.empty((0),dtype='str')
	
	for each in txt_array:
		list_strings_txt_each = each.split()
		
		for each_txt in list_strings_txt_each:			
			split_txt_array = np.append(split_txt_array,[each_txt],axis=0)	
	
	
	
	for index_best_array, each in enumerate(product_names_2):	
		list_strings = each.split()	
		txt_match_array = np.empty((len(list_strings),1),dtype='bool')
		for index, each_string in enumerate( list_strings):
			present =False		
			each_str_lc= each_string.lower()
			
			for eachTxt in split_txt_array:			
				eachTxt_lc= eachTxt.lower()				
				if (each_str_lc in eachTxt_lc) or (eachTxt_lc in each_str_lc):
					#print ('MATCH$$$$$$$$$$$$$$$$$$$$$$'+ '   '+ each_str_lc+  '   '+ 'and'+ '    '+eachTxt_lc)
					#print('each:'+each)
					present=True					
					break
		
		
			if (present == True):
				txt_match_array[index]=True
			else :				
				txt_match_array[index]=False
		
		count_false=0
		for each in txt_match_array:
			if (each == False):					
				count_false+=1
		
		count_false_array[index_best_array]=count_false
		
		if(count_false<=0):			
			new_array=np.append(new_array,[best_array[index_best_array]],axis=0)

	
	isMin= True
	return_array= np.empty((0,best_array.shape[1]),dtype='str')
	indx_min= np.argmin(count_false_array)
	while (isMin)	:	
		return_array=np.append(return_array,[best_array[indx_min,:]],axis =0)
		val = count_false_array[indx_min]
		count_false_array[indx_min]=5000#arbitrary large number
		ind_min_nxt = np.argmin(count_false_array)
		if (val<count_false_array[ind_min_nxt]):
			isMin=False
		else :
			indx_min=ind_min_nxt	

	return return_array

			
def compare_product_names_to_img_txt_B(txt_array,best_array):
	
	
	scores_each_name= np.empty(len(best_array),dtype='float')
	
	product_names = best_array[:,3]
	
	product_names_alpha_num = remove_non_alpha_numerica_characters(product_names)	
	
	product_names_2=insert_spaces_into_strings_with_gaps(product_names_alpha_num)		
	
	split_txt_array = np.empty((0),dtype='str')
	
	for each in txt_array:
		list_strings_txt_each = each.split()
		
		for each_txt in list_strings_txt_each:			
			split_txt_array = np.append(split_txt_array,[each_txt],axis=0)
	

	for index_best_array, each in enumerate(product_names_2):	
		
		list_strings = each.split()			
		count_false=0
		count_true=0
		
		
		for index, each_string in enumerate( list_strings):
			each_str_lc=	each_string.lower()		
			
			length_each_str_lc=len(each_str_lc)
			if (length_each_str_lc<=2):
				present = None
			else :
				present =False				
				
			for eachTxt in split_txt_array:			
				eachTxt_lc= eachTxt.lower()
				length_eachTxt_lc=len(eachTxt_lc)
				
				if ((length_eachTxt_lc<=2 or length_each_str_lc<=2 ) and length_eachTxt_lc!=length_each_str_lc):		
					continue						
				elif  (each_str_lc in eachTxt_lc) or (eachTxt_lc in each_str_lc):
					print ('MATCH$$$$$$$$$$$$$$$$$$$$$$'+ '   '+ each_str_lc+  '   '+ 'and'+ '    '+eachTxt_lc)
					print('each:'+each)
					present=True					
					break		
			
			if (present == True):
				count_true += 1.5
			elif (present == False) :				
				count_false+=1			
			
		total_count_score = count_false-count_true
		
		scores_each_name[index_best_array]=total_count_score
		


	
	isMin= True
	return_array= np.empty((0,best_array.shape[1]),dtype='str')
	indx_min= np.argmin(scores_each_name)
	while (isMin)	:	
		return_array=np.append(return_array,[best_array[indx_min,:]],axis =0)
		val = scores_each_name[indx_min]
		scores_each_name[indx_min]=5000#arbitrary large number
		ind_min_nxt = np.argmin(scores_each_name)
		if (val<scores_each_name[ind_min_nxt]):
			isMin=False
		else :
			indx_min=ind_min_nxt	

	return return_array
						

import base64
from flask import request

@app.route('/scan_remote_med_img', methods=['POST', 'GET'])
def scan_remote_med_img():		
	if request.method == 'POST':			
	    imgdata = request.data        						
	    decoded_each = base64.b64decode(imgdata)
	    array = enter_img_data(decoded_each)
	    return convert_json(array)

def enter_img_data(imgdata):
		
	textArray, textBoundsArray = detect_text_custom_remote(imgdata)	
	ndcNotePresent,title,ndc_Number=asses_label_txt_for_NDC(textArray)
		
	if ndcNotePresent:
		print( title)
		return title
	else :
		open_meds_db()
		best_array = asses_label_txt_controller(textArray, textBoundsArray)
		#print (best_array[:,3] )
		#print('\n\n\n\n\n\n')
		#print ('INSIDE begin_image_txt_detection_local to METHOD#################')
		#print('\n\n')
		#print(best_array)
		close_meds_db()

	#string_array = np.array_str(best_array)	

	return best_array	
		



def begin_image_txt_detection_local(fileNameString):	

	
	execution_path = os.getcwd()
		
	input_image=os.path.join(execution_path ,fileNameString)

	textArray, textBoundsArray = detect_text_custom_local(input_image)	
	ndcNotePresent,title,ndc_Number=asses_label_txt_for_NDC(textArray)		
	
	if ndcNotePresent:
		return title
	else:
		open_meds_db()
		best_array = asses_label_txt_controller(textArray, textBoundsArray)	

		close_meds_db()
	
		return best_array
			
med_attr = ["rowid","title","setid","product_name_form", "product_name_generic","company"]
def convert_json(array):
	meds_list = []
	for med in array:
		med_dict = {}
		for idx, val in enumerate(med):
			med_dict[med_attr[idx]] = val

	meds_list.append(med_dict)
	json_list = json.dumps(meds_list)		
	return json_list




@app.route('/txt_detection_benadryl_label')
def txt_detection_benadryl_label():
	array = begin_image_txt_detection_local('example_imgs/benadryl.png')	
	json = convert_json(array)
	return json  

@app.route('/txt_detection_advil_label')	
def txt_detection_advil_label():
	array = begin_image_txt_detection_local('example_imgs/advil.png')	
	json = convert_json(array)
	return json    




if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]


