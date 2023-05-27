# 此程式會將乘法的分類結果回傳
def multiplication_classify(value1, value2):
    classify_result = {"tag": [], "strategy": None}

    # 建立分類規則的字典，用來迭代尋找符合的分類標籤
    # 分類標籤須按學習階段由低到高排列（低年級 -> 高年級）
    classify_rule = {
        "0 和 1 的乘法": __multiplication_of_0_or_1,
        "十十乘法表": __ten_ten_multiplication_table,
        "二位數乘以一位數": __two_digit_times_one_digit,
        "三位數乘以一位數": __three_digit_times_one_digit,
        "乘數為一位數": __multiplier_is_one_digit,
        "乘數為二位數": __multiplier_is_two_digit,
        "二位數乘以三位數": __two_digit_times_three_digit,
        "乘數為三位數": __multiplier_is_three_digit,
        "末位是 0 的乘法": __the_last_bit_is_0,
        "大數乘法": __multiplication_of_large_numbers
    }

    # 建立分類標籤所對應的詳解工具之字典
    # 若有新增的分類標籤或詳解工具，請記得修改此字典
    strategy_table = {
        "橫式乘法": ["0 和 1 的乘法"],
        "查表、橫式乘法": ["十十乘法表"],
        "直式乘法": [
            "二位數乘以一位數", "三位數乘以一位數", "乘數為一位數", "乘數為二位數", 
            "二位數乘以三位數", "乘數為三位數", "末位是 0 的乘法", "大數乘法"
        ]
    }

    try:
        # 迭代尋找符合的所有分類標籤
        for key in classify_rule:
            if classify_rule[key](value1, value2):
                classify_result["tag"].append(key)

        # 詳解工具由學習階段最早的分類標籤決定
        for key in strategy_table:
            if classify_result["tag"][0] in strategy_table[key]:
                classify_result["strategy"] = key

        return classify_result
    except Exception as err:
        print(err)
        classify_result["tag"].append("multiplication_classify.py 有 Bug, 須排除")
        classify_result["strategy"] = "因程式有錯誤，故無對應詳解工具"
        return classify_result

# 分類規則：0 和 1 的乘法
def __multiplication_of_0_or_1(value1, value2):
    if int(value1) == 0 or int(value1) == 1 or int(value2) == 0 or int(value2) == 1:
        return True
    return False

# 分類規則：十十乘法表
def __ten_ten_multiplication_table(value1, value2):
    if int(value1) in range(2, 11) and int(value2) in range(2, 11):
        return True
    return False

# 分類規則：二位數乘以一位數
def __two_digit_times_one_digit(value1, value2):
    if len(value1) == 2 and len(value2) == 1:
        return True
    return False

# 分類規則：三位數乘以一位數
def __three_digit_times_one_digit(value1, value2):
    if len(value1) == 3 and len(value2) == 1:
        return True
    return False

# 分類規則：乘數為一位數
def __multiplier_is_one_digit(value1, value2):
    if len(value2) == 1:
        return True
    return False

# 分類規則：乘數為二位數
def __multiplier_is_two_digit(value1, value2):
    if len(value2) == 2:
        return True
    return False

# 分類規則：二位數乘以三位數
def __two_digit_times_three_digit(value1, value2):
    if len(value1) == 2 and len(value2) == 3:
        return True
    return False

# 分類規則：乘數為三位數
def __multiplier_is_three_digit(value1, value2):
    if len(value2) == 3:
        return True
    return False

# 分類規則：末位是 0 的乘法
def __the_last_bit_is_0(value1, value2):
    if int(value1) != 0 and int(value2) != 0:
        if value1[-1] == "0" or value2[-1] == "0":
            return True
    return False

# 分類規則：大數乘法
def __multiplication_of_large_numbers(value1, value2):
    if len(value1) >= 4 or len(value2) >= 4:
        return True
    return False