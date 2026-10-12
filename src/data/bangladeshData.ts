export interface BangladeshLocationHierarchy {
  [division: string]: {
    [district: string]: string[];
  };
}

export const BANGLADESH_LOCATIONS: BangladeshLocationHierarchy = {
  "Dhaka": {
    "Dhaka (ঢাকা)": [
      "Mirpur (মিরপুর)", "Uttara (উত্তরা)", "Gulshan (গুলশান)", "Dhanmondi (ধানমন্ডি)", 
      "Motijheel (মতিঝিল)", "Badda (বাড্ডা)", "Tejgaon (টেজগাঁও)", "Savar (সাভার)", 
      "Dhamrai (ধামরাই)", "Dohar (দোহার)", "Nawabganj (নবাবগঞ্জ)", "Keraniganj (কেরানীগঞ্জ)", 
      "Mohammadpur (মোহাম্মদপুর)", "Khilgaon (খিলগাঁও)", "Paltan (পল্টন)", "Ramna (রমনা)", 
      "Shahbagh (শাহবাগ)", "Jatrabari (যাত্রাবাড়ী)", "Demra (ডেমরা)", "Kadamtali (কদমতলী)", 
      "Kamrangirchar (কামরাঙ্গীরচর)", "Kotwali (কোতোয়ালী)", "Sutrapur (সূত্রাপুর)", 
      "Hazaribagh (হাজারীবাগ)", "Cantonment (ক্যান্টনমেন্ট)", "Kafrul (কাফরুল)", 
      "Darussalam (দারুস সালাম)", "Mirpur Model (মিরপুর মডেল)", "Pallabi (পল্লবী)", 
      "Turag (তুরাগ)", "Uttara West (উত্তরা পশ্চিম)", "Uttara East (উত্তরা পূর্ব)", 
      "Dakshinkhan (দক্ষিণখান)", "Uttarkhan (উত্তরখান)", "Khilkhet (খিলক্ষেত)", 
      "Vatara (ভাটারা)", "Rampura (রামপুরা)", "Shah Ali (শাহ আলী)", "Sher-e-Bangla Nagar (শেরেবাংলা নগর)", 
      "Adabor (আদাবর)", "Tejgaon Industrial Area (Tejgaon Industrial Area)", "Hatirjheel (হাতিরঝিল)", 
      "Chowkbazar (চকবাজার)", "Gendaria (গেন্ডারিয়া)", "Lalbagh (লালবাগ)", "Wari (ওয়ারী)", 
      "Shyampur (শ্যামপুর)", "Mugda (মুগদা)", "New Market (নিউ মার্কেট)", "Banani (বনানী)", 
      "Rupnagar (রূপনগর)", "Bhasantek (ভাষানটেক)", "Sabujbagh (সবুজবাগ)"
    ],
    "Gazipur (গাজীপুর)": [
      "Sadar (সদর)", "Tongi (টঙ্গী)", "Sreepur (শ্রীপুর)", "Kaliakair (কালিয়াকৈর)", 
      "Kaliganj (কালীগঞ্জ)", "Kapasia (কপাসিয়া)", "Tongi East (টঙ্গী পূর্ব)", "Tongi West (টঙ্গী পশ্চিম)"
    ],
    "Narayanganj (নারায়ণগঞ্জ)": [
      "Sadar (সদর)", "Bandar (বন্দর)", "Rupganj (রূপগঞ্জ)", "Araihazar (আড়াইহাজার)", 
      "Sonargaon (সোনারগাঁও)", "Siddhirganj (সিদ্ধিরগঞ্জ)"
    ],
    "Narsingdi (নরসিংদী)": [
      "Sadar (সদর)", "Belabo (বেলাবো)", "Monohardi (মনোহরদী)", "Palash (পলাশ)", 
      "Raipura (রায়পুরা)", "Shibpur (শিবপুর)"
    ],
    "Manikganj (মানিকগঞ্জ)": [
      "Sadar (সদর)", "Singair (সিংগাইর)", "Shibalaya (শিবালয়)", "Saturia (সাটুরিয়া)", 
      "Harirampur (হরিরামপুর)", "Ghior (ঘিওর)", "Daulatpur (দৌলতপুর)"
    ],
    "Munshiganj (মুন্সীগঞ্জ)": [
      "Sadar (সদর)", "Tongibari (টংগিবাড়ী)", "Srinagar (শ্রীনগর)", "Lohajang (লৌহজং)", 
      "Gajaria (গজারিয়া)", "Sirajdikhan (সিরাজদিখান)"
    ],
    "Faridpur (ফরিদপুর)": [
      "Sadar (সদর)", "Madhukhali (মধুখালী)", "Boalmari (বোয়ালমারী)", "Alfadanga (আলফাডাঙ্গা)", 
      "Saltha (সালথা)", "Nagarkanda (নগরকান্দা)", "Bhanga (ভাঙ্গা)", "Sadarpur (সদরপুর)", 
      "Charbhadrasan (চরভদ্রাসন)"
    ],
    "Gopalganj (গোপালগঞ্জ)": [
      "Sadar (সদর)", "Kotalipara (কোটালীপাড়া)", "Tungipara (টুঙ্গিপাড়া)", "Kasiani (কাশিয়ানী)", 
      "Muksudpur (মুকসুদপুর)"
    ],
    "Madaripur (মাদারীপুর)": [
      "Sadar (সদর)", "Shibchar (শিবচর)", "Kalkini (কালকিনি)", "Rajoir (রাজৈর)"
    ],
    "Rajbari (রাজবাড়ী)": [
      "Sadar (সদর)", "Goalanda (গোয়ালন্দ)", "Pangsha (পাংশা)", "Baliakandi (বালিয়াকান্দি)", 
      "Kalukhali (কালুখালী)"
    ],
    "Shariatpur (শরীয়তপুর)": [
      "Sadar (সদর)", "Naria (নড়িয়া)", "Zajira (জাজিরা)", "Gosairhat (গোসাইরহাট)", 
      "Damudya (ডামুড্যা)", "Bhedarganj (ভেদরগঞ্জ)"
    ],
    "Tangail (টাঙ্গাইল)": [
      "Sadar (সদর)", "Sakhipur (সখিপুর)", "Basail (বাসাইল)", "Madhupur (মধুপুর)", 
      "Ghatail (ঘাটাইল)", "Kalihati (কালিহাতী)", "Nagarpur (নাগরপুর)", "Mirzapur (মির্জাপুর)", 
      "Gopalpur (গোপালপুর)", "Delduar (দেলদুয়ার)", "Bhuapur (ভূয়াপুর)", "Dhanbari (ধনবাড়ী)"
    ],
    "Kishoreganj (কিশোরগঞ্জ)": [
      "Sadar (সদর)", "Itna (ইটনা)", "Katiadi (কটিয়াদী)", "Bhairab (ভৈরব)", 
      "Tarail (তাড়াইল)", "Hossainpur (হোসেনপুর)", "Pakundia (পাকুন্দিয়া)", "Kuliarchar (কুলিয়ারচর)", 
      "Karimgonj (করিমগঞ্জ)", "Bajitpur (বাজিতপুর)", "Astagram (অষ্টগ্রাম)", "Mithamoin (মিঠামইন)", 
      "Nikli (নিকলী)"
    ]
  },
  "Chattogram": {
    "Chattogram (চট্টগ্রাম)": [
      "Panchlaish (পাঁচলাইশ)", "Double Mooring (ডাবল মুরিং)", "Halishahar (হালিশহর)", 
      "Kotwali (কোতোয়ালী)", "Patenga (পতেঙ্গা)", "Pahartali (পাহাড়তলী)", "Chandgaon (চান্দগাঁও)", 
      "Bandar (বন্দর)", "Bakalia (বাকলিয়া)", "Bayazid (বায়েজিদ)", "Khulshi (খুলশী)", 
      "Anwara (আনোয়ারা)", "Banshkhali (বাঁশখালী)", "Boalkhali (বোয়ালখালী)", "Chandanaish (চন্দনাইশ)", 
      "Fatikchhari (ফটিকছড়ি)", "Hathazari (হাটহাজারী)", "Lohagara (লোহাগড়া)", "Mirsharai (মীরসরাই)", 
      "Patiya (পটিয়া)", "Rangunia (রাঙ্গুনিয়া)", "Raozan (রাউজান)", "Sandwip (সন্দ্বীপ)", 
      "Satkania (সাতকানিয়া)", "Sitakunda (সীতাকুণ্ড)"
    ],
    "Cox's Bazar (কক্সবাজার)": [
      "Sadar (সদর)", "Chakaria (চকোরিয়া)", "Maheshkhali (মহেশখালী)", "Teknaf (টেকনাফ)", 
      "Ukhia (উখিয়া)", "Ramu (রামু)", "Kutubdia (কুতুবদিয়া)", "Pekua (পেকুয়া)"
    ],
    "Cumilla (কুমিল্লা)": [
      "Adarsha Sadar (আদর্শ সদর)", "Sadar South (সদর দক্ষিণ)", "Chauddagram (চৌদ্দগ্রাম)", 
      "Laksam (লাকসাম)", "Debidwar (দেবিদ্বার)", "Burichang (বুড়িচং)", "Brahmanpara (ব্রাহ্মণপাড়া)", 
      "Chandina (চান্দিনা)", "Barura (বরুড়া)", "Daoudkandi (দাউদকান্দি)", "Homna (হোমনা)", 
      "Muradnagar (মুরাদনগর)", "Meghna (মেঘনা)", "Monohorganj (মনোহরগঞ্জ)", "Titas (তিতাস)", 
      "Nangalkot (নাঙ্গলকোট)"
    ],
    "Feni (ফেনী)": [
      "Sadar (সদর)", "Chhagalnaiya (ছাগলনাইয়া)", "Daganbhuiyan (দাগনভূঞা)", "Parshuram (পরশুরাম)", 
      "Fulgazi (ফুলগাজী)", "Sonagazi (সোনাগাজী)"
    ],
    "Brahmanbaria (ব্রাহ্মণবাড়িয়া)": [
      "Sadar (সদর)", "Kasba (কসবা)", "Nabinagar (নবীনগর)", "Sarail (সরাইল)", 
      "Ashuganj (আশুগঞ্জ)", "Nasirnagar (নাসিরনগর)", "Bancharampur (বাঞ্ছারামপুর)", 
      "Bijoynagar (বিজয়নগর)", "Akhaura (আখাউড়া)"
    ],
    "Chandpur (চাঁদপুর)": [
      "Sadar (সদর)", "Hajiganj (হাজীগঞ্জ)", "Faridganj (ফরিদগঞ্জ)", "Shahrasti (শাহরাস্তি)", 
      "Kachua (কচুয়া)", "Matlab North (মতলব উত্তর)", "Matlab South (মতলব দক্ষিণ)", "Haimchar (হাইমচর)"
    ],
    "Lakshmipur (লক্ষ্মীপুর)": [
      "Sadar (সদর)", "Kamalnagar (কমলনগর)", "Ramganj (রামগঞ্জ)", "Ramgati (রামগতি)", 
      "Raipur (রায়পুর)"
    ],
    "Noakhali (নোয়াখালী)": [
      "Sadar (সদর)", "Begumganj (বেগমগঞ্জ)", "Chatkhil (চাটখিল)", "Companyganj (কোম্পানীগঞ্জ)", 
      "Hatiya (হাতিয়া)", "Senbagh (সেনবাগ)", "Subarnachar (সুবর্ণচর)", "Sonaimuri (সোনাইমুড়ী)", 
      "Kabirhat (কবিরহাট)"
    ],
    "Bandarban (বান্দরবান)": [
      "Sadar (সদর)", "Thanchi (থানচি)", "Lama (লামা)", "Naikhongchhari (নাইক্ষ্যংছড়ি)", 
      "Ali Kadam (আলীকদম)", "Rowangchhari (রোয়াংছড়ি)", "Ruma (রুমা)"
    ],
    "Khagrachhari (খাগড়াছড়ি)": [
      "Sadar (সদর)", "Dighinala (দিঘীনালা)", "Panchhari (পানছড়ি)", "Laxmichhari (লক্ষ্মীছড়ি)", 
      "Mahalchhari (মহালছড়ি)", "Manikchhari (মানিকছড়ি)", "Matiranga (মাটিরাঙ্গা)", 
      "Ramgarh (রামগড়)", "Guimara (গুইমারা)"
    ],
    "Rangamati (রাঙ্গামাটি)": [
      "Sadar (সদর)", "Kaptai (কাপ্তাই)", "Kawkhali (কাউখালী)", "Baghaichhari (বাঘাইছড়ি)", 
      "Barkal (বরকল)", "Langadu (লংগদু)", "Rajasthali (রাজস্থলী)", "Belaichhari (বিলাইছড়ি)", 
      "Juraichhari (জুরাইছড়ি)", "Naniarchar (নানিয়ারচর)"
    ]
  },
  "Rajshahi": {
    "Rajshahi (রাজশাহী)": [
      "Boalia (বোয়ালিও)", "Motihar (মতিহার)", "Rajpara (রাজপাড়া)", "Shah Makhdum (শাহ মখদুম)", 
      "Godagari (গোদাগাড়ী)", "Tanore (তানোর)", "Bagmara (বাগমারা)", "Durgapur (দুর্গাপুর)", 
      "Puthia (পুঠিয়া)", "Charghat (চারঘাট)", "Bagha (বাঘা)", "Paba (পবা)", 
      "Mohonpur (মোহনপুর)"
    ],
    "Bogura (বগুড়া)": [
      "Sadar (সদর)", "Sherpur (শেরপুর)", "Shajahanpur (শাজাহানপুর)", "Dupchanchia (দুপচাঁচিয়া)", 
      "Adamdighi (আদমদিঘী)", "Kahaloo (কাহালু)", "Nandigram (নন্দীগ্রাম)", "Gabtali (গাবতলী)", 
      "Dhunat (ধুনট)", "Sariakandi (সারিয়াকান্দি)", "Sonatala (সোনাতলা)", "Shibganj (শিবগঞ্জ)"
    ],
    "Pabna (পাবনা)": [
      "Sadar (সদর)", "Ishwardi (ঈশ্বরদী)", "Sujanagar (সুজানগর)", "Chatmohar (চাটমোহর)", 
      "Bhangura (ভাঙ্গুড়া)", "Faridpur (ফরিদপুর)", "Bera (বেড়া)", "Santhia (সাঁথিয়া)", 
      "Atgharia (আটঘরিয়া)"
    ],
    "Natore (নাটোর)": [
      "Sadar (সদর)", "Singra (সিংড়া)", "Baraigram (বড়াইগ্রাম)", "Lalpur (লালপুর)", 
      "Bagatipara (বাগাতিপাড়া)", "Gurudaspur (গুরুদাসপুর)", "Naldanga (নলডাঙ্গা)"
    ],
    "Naogaon (নওগাঁ)": [
      "Sadar (সদর)", "Raninagar (রাণীনগর)", "Atrai (আত্রাই)", "Badalgachhi (বদলগাছী)", 
      "Mahadebpur (মহাদেবপুর)", "Anik (আনিক)", "Dhamoirhat (ধামইরহাট)", "Sapahar (সাপাহার)", 
      "Porsha (পোরশা)", "Manda (মান্দা)", "Niamatpur (নিয়ামতপুর)", "Patnitala (পত্নীতলা)"
    ],
    "Joypurhat (জয়পুরহাট)": [
      "Sadar (সদর)", "Panchbibi (পাঁচবিবি)", "Kalai (কালাই)", "Khetlal (ক্ষেতলাল)", 
      "Akkelpur (আক্কেলপুর)"
    ],
    "Chapainawabganj (চাঁপাইনবাবগঞ্জ)": [
      "Sadar (সদর)", "Shibganj (শিবগঞ্জ)", "Bholahat (ভোলাহাট)", "Nachole (নাচোল)", 
      "Gomastapur (গোমস্তাপুর)"
    ],
    "Sirajganj (সিরাজগঞ্জ)": [
      "Sadar (সদর)", "Belkuchi (বেলকুচি)", "Chauhali (চৌহালী)", "Kamarkhanda (কামারখন্দ)", 
      "Kazipur (কাজীপুর)", "Rayganj (রায়গঞ্জ)", "Shahjadpur (শাহজাদপুর)", "Tarash (তাড়াশ)", 
      "Ullahpara (উল্লাপাড়া)"
    ]
  },
  "Khulna": {
    "Khulna (খুলনা)": [
      "Sadar (সদর)", "Sonadanga (সোনাডাঙ্গা)", "Khalishpur (খালিশপুর)", "Daulatpur (দৌলতপুর)", 
      "Khan Jahan Ali (খান জাহান আলী)", "Harintana (হরিণটানা)", "Arongghata (আড়ংঘাটা)", 
      "Batiaghata (বটিয়াঘাটা)", "Dacope (দাকোপ)", "Dumuria (ডুমুরিয়া)", "Digholia (দিঘলিয়া)", 
      "Koyra (কয়রা)", "Paikgachha (পাইকগাছা)", "Phultala (ফুলতলা)", "Rupsha (রূপসা)", 
      "Terokhada (তেরখাদা)"
    ],
    "Jashore (যশোর)": [
      "Sadar (সদর)", "Abhaynagar (অভয়নগর)", "Bagherpara (বাঘারপাড়া)", "Chougachha (চৌগাছা)", 
      "Jhikargacha (ঝিকরগাছা)", "Keshabpur (কেশবপুর)", "Manirampur (মণিরামপুর)", "Sharsha (শার্শা)"
    ],
    "Bagerhat (বাগেরহাট)": [
      "Sadar (সদর)", "Mongla (মংলা)", "Morrelganj (মোড়েলগঞ্জ)", "Sarankhola (শরণখোলা)", 
      "Chitalmari (চিতলমারী)", "Fakirhat (ফকিরহাট)", "Kachua (কচুয়া)", "Mollahat (মোল্লাহাট)", 
      "Rampal (রামপাল)"
    ],
    "Satkhira (সাতক্ষীরা)": [
      "Sadar (সদর)", "Assasuni (আশাশুনি)", "Debhata (দেবহাটা)", "Kalaroa (কলারোয়া)", 
      "Kaliganj (কালীগঞ্জ)", "Shyamnagar (শ্যামনগর)", "Tala (তালা)"
    ],
    "Kushtia (কুষ্টিয়া)": [
      "Sadar (সদর)", "Kumarkhali (কুমারখালী)", "Khoksa (খোকসা)", "Mirpur (মিরপুর)", 
      "Daulatpur (দৌলতপুর)", "Bheramara (ভেড়ামারা)"
    ],
    "Jhenaidah (ঝিনাইদহ)": [
      "Sadar (সদর)", "Kaliganj (কালীগঞ্জ)", "Kotchandpur (কোটচাঁদপুর)", "Maheshpur (মহেশপুর)", 
      "Shailkupa (শৈলকুপা)", "Harinakundu (হরিণাকুণ্ড)"
    ],
    "Magura (মাগুরা)": [
      "Sadar (সদর)", "Sreepur (শ্রীপুর)", "Shalikha (শালিখা)", "Mohammadpur (মোহাম্মদপুর)"
    ],
    "Meherpur (মেহেরপুর)": [
      "Sadar (সদর)", "Mujibnagar (মুজিবনগর)", "Gangni (গাংনী)"
    ],
    "Narail (নড়াইল)": [
      "Sadar (সদর)", "Lohagara (লোহাগড়া)", "Kalia (কালিয়া)"
    ],
    "Chuadanga (চুয়াডাঙ্গা)": [
      "Sadar (সদর)", "Alamdanga (আলমডাঙ্গা)", "Damurhuda (দামুড়হুদা)", "Jibannagar (জীবননগর)"
    ]
  },
  "Barishal": {
    "Barishal (বরিশাল)": [
      "Sadar (সদর)", "Bakerganj (বাকেরগঞ্জ)", "Babuganj (বাবুগঞ্জ)", "Wazirpur (উজিরপুর)", 
      "Banaripara (বানারীপাড়া)", "Gournadi (গৌরনদী)", "Agailjhara (আগৈলঝারা)", 
      "Muladi (মুলাদী)", "Hizla (হিজলা)", "Mehendiganj (মেহেন্দিগঞ্জ)"
    ],
    "Bhola (ভোলা)": [
      "Sadar (সদর)", "Burhanuddin (বোরহানউদ্দিন)", "Char Fasson (চরফ্যাশন)", "Daulatkhan (দৌলতখান)", 
      "Lalmohan (লালমোহন)", "Manpura (মনপুরা)", "Tazumuddin (তাজুমদ্দিন)"
    ],
    "Patuakhali (পটুয়াখালী)": [
      "Sadar (সদর)", "Bauphal (বাউফল)", "Galachipa (গলাচিপা)", "Kalapara (কলাপাড়া)", 
      "Mirzaganj (মির্জাগঞ্জ)", "Dumki (দুমকী)", "Dashmina (দশমিনা)", "Rangabali (রাঙ্গাবালী)"
    ],
    "Pirojpur (পিরোজপুর)": [
      "Sadar (সদর)", "Bhandaria (ভাণ্ডারিয়া)", "Kawkhali (কাউখালী)", "Mathbaria (মঠবাড়ীয়া)", 
      "Nazirpur (নাজিরপুর)", "Nesarabad (নেছারাবাদ)", "Zianagar (জিয়ানগর)"
    ],
    "Jhalokati (ঝালকাঠি)": [
      "Sadar (সদর)", "Kathalia (কাঠালিয়া)", "Nalchity (নলছিটি)", "Rajapur (রাজাপুর)"
    ],
    "Barguna (বরগুনা)": [
      "Sadar (সদর)", "Amtali (আমতলী)", "Bamna (বামনা)", "Betagi (বেতাকী)", 
      "Patharghata (পাথরঘাটা)", "Taltali (তালতলী)"
    ]
  },
  "Sylhet": {
    "Sylhet (সিলেট)": [
      "Kotwali (কোতোয়ালী)", "Shah Paran (শাহ পরান)", "South Surma (দক্ষিণ সুরমা)", "Balaganj (বালাগঞ্জ)", 
      "Beanibazar (বিয়ানীবাজার)", "Bishwanath (বিশ্বনাথ)", "Companiganj (কোম্পানীগঞ্জ)", 
      "Fenchuganj (ফেঞ্চুগঞ্জ)", "Golapganj (গোলাপগঞ্জ)", "Gowainghat (গোয়াইনঘাট)", 
      "Jaintiapur (জৈন্তাপুর)", "Kanaighat (কানাইঘাট)", "Zakiganj (জকিগঞ্জ)"
    ],
    "Moulvibazar (মৌলভীবাজার)": [
      "Sadar (সদর)", "Barlekha (বড়লেখা)", "Juri (জুড়ী)", "Kamalganj (কমলগঞ্জ)", 
      "Kulaura (কুলাউড়া)", "Rajnagar (রাজনগর)", "Sreemangal (শ্রীমঙ্গল)"
    ],
    "Habiganj (হবিগঞ্জ)": [
      "Sadar (সদর)", "Bahubal (বাহুবল)", "Baniyachong (বানিয়াচং)", "Chunarughat (চুনারুঘাট)", 
      "Lakhai (লাখাই)", "Madhabpur (মাধবপুর)", "Nabiganj (নবীগঞ্জ)", "Ajmiriganj (আজমিরীগঞ্জ)"
    ],
    "Sunamganj (সুনামগঞ্জ)": [
      "Sadar (সদর)", "South Sunamganj (দক্ষিণ সুনামগঞ্জ)", "Bishwambharpur (বিশ্বম্ভরপুর)", 
      "Chhatak (ছাতক)", "Derai (দিরাই)", "Dharampasha (ধর্মপাশা)", "Dowarabazar (দোয়ারাবাজার)", 
      "Jagannathpur (জগন্নাথপুর)", "Jamalganj (জামালগঞ্জ)", "Sullah (শাল্লা)", "Tahirpur (তাহিরপুর)"
    ]
  },
  "Rangpur": {
    "Rangpur (রংপুর)": [
      "Sadar (সদর)", "Badarganj (বদরগঞ্জ)", "Gangachara (গঙ্গাচড়া)", "Kaunia (কাউনিয়া)", 
      "Mithapukur (মিঠাপুকুর)", "Pirgachha (পীরগাছা)", "Pirganj (পীরগঞ্জ)", "Taraganj (তারাগঞ্জ)"
    ],
    "Dinajpur (দিনাজপুর)": [
      "Sadar (সদর)", "Birganj (বীরগঞ্জ)", "Biral (বিরল)", "Bochaganj (বোচাগঞ্জ)", 
      "Kaharole (কাহারোল)", "Khansama (খানসামা)", "Birol (বিরল)", "Parbatipur (পার্বতীপুর)", 
      "Phulbari (ফুলবাড়ী)", "Ghoraghat (ঘোড়াঘাট)", "Hakimpur (হাকিমপুর)", "Nawabganj (নবাবগঞ্জ)", 
      "Chirirbandar (চিরিরবন্দর)"
    ],
    "Kurigram (কুড়িগ্রাম)": [
      "Sadar (সদর)", "Bhurungamari (ভুরুঙ্গামারী)", "Char Rajibpur (রাজিবপুর)", "Chilmari (চিলমারী)", 
      "Phulbari (ফুলবাড়ী)", "Nageshwari (নাগেশ্বরী)", "Rajarhat (রাজারহাট)", "Rowmari (রৌমারী)", 
      "Ulipur (উলিপুর)"
    ],
    "Gaibandha (গাইবান্ধা)": [
      "Sadar (সদর)", "Phulchhari (ফুলছড়ি)", "Gobindaganj (গোবিন্দগঞ্জ)", "Palashbari (পলাশবাড়ী)", 
      "Sadullapur (সাদুল্লাপুর)", "Saghata (সাঘাটা)", "Sundarganj (সুন্দরগঞ্জ)"
    ],
    "Lalmonirhat (লালমনিরহাট)": [
      "Sadar (সদর)", "Aditmari (আদিতমারী)", "Hatibandha (হাতীবান্ধা)", "Kaliganj (কালীগঞ্জ)", 
      "Patgram (পাটগ্রাম)"
    ],
    "Nilphamari (নীলফামারী)": [
      "Sadar (সদর)", "Saidpur (সৈয়দপুর)", "Jaldhaka (জলঢাকা)", "Kishoreganj (কিশোরগঞ্জ)", 
      "Domar (ডোমার)", "Dimla (ডিমলা)"
    ],
    "Panchagarh (পঞ্চগড়)": [
      "Sadar (সদর)", "Boda (বোদা)", "Debiganj (দেবীগঞ্জ)", "Atwari (আটোয়ারী)", "Tetulia (তেঁতুলিয়া)"
    ],
    "Thakurgaon (ঠাকুরগাঁও)": [
      "Sadar (সদর)", "Pirganj (পীরগঞ্জ)", "Ranisankail (রাণীশংকৈল)", "Haripur (হরিপুর)", "Baliadangi (বালিয়াডাঙ্গী)"
    ]
  },
  "Mymensingh": {
    "Mymensingh (ময়মনসিংহ)": [
      "Sadar (সদর)", "Bhaluka (ভালুকা)", "Gauripur (গৌরীপুর)", "Haluaghat (হালুয়াঘাট)", 
      "Ishwarganj (ঈশ্বরগঞ্জ)", "Muktagachha (মুক্তাগাছা)", "Nandail (নান্দাইল)", "Phulpur (ফুলপুর)", 
      "Trishal (ত্রিশাল)", "Dhobaura (ধোবাউড়া)", "Fulbaria (ফুলবাড়ীয়া)", "Gafargaon (গফরগাঁও)", 
      "Tara Kanda (তারাকান্দা)"
    ],
    "Jamalpur (জামালপুর)": [
      "Sadar (সদর)", "Bakshiganj (বকশীগঞ্জ)", "Dewanganj (দেওয়ানগঞ্জ)", "Isampur (ইসলামপুর)", 
      "Madarganj (মাদারগঞ্জ)", "Melandaha (মেলান্দহ)", "Sarishabari (সরিষাবাড়ী)"
    ],
    "Netrokona (নেত্রকোনা)": [
      "Sadar (সদর)", "Atpara (আটপাড়া)", "Barhatta (বারহাট্টা)", "Durgapur (দুর্গাপুর)", 
      "Khaliajuri (খালিয়াজুরী)", "Kalmakanda (কলমাকান্দা)", "Kendua (কেন্দুয়া)", "Madan (মদন)", 
      "Mohanganj (মোহনগঞ্জ)", "Purbadhala (পূর্বধলা)"
    ],
    "Sherpur (শেরপুর)": [
      "Sadar (সদর)", "Sreebardi (শ্রীবরদী)", "Nakla (নকলা)", "Nalitabari (নালিতাবাড়ী)", "Jhenaigati (ঝিনাইগাতী)"
    ]
  }
};
