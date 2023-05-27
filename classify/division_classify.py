# 此程式會將除法的分類結果回傳
def division_classify(value1, value2):
    classify_result = {"tag": [], "strategy": None}

    # 建立分類規則的字典，用來迭代尋找符合的分類標籤
    # 分類標籤須按學習階段由低到高排列（低年級 -> 高年級）
    classify_rule = {
        "0 和 1 的除法": __division_of_0_or_1,
        "除數為一位數": __divisor_is_one_digit,
        "四位數除以一位數": __four_digit_divided_one_digit,
        "二位數除以二位數": __two_digit_divided_two_digit,
        "三位數除以二位數": __three_digit_divided_two_digit,
        "四位數除以二位數": __four_digit_divided_two_digit,
        "四位數除以三位數": __four_digit_divided_three_digit,
        "除數為三位數": __divisor_is_three_digit,
        "末位是 0 的除法": __the_last_bit_is_0,
        "大數除法": __division_of_large_numbers
    }

    # 建立分類標籤所對應的詳解工具之字典
    # 若有新增的分類標籤或詳解工具，請記得修改此字典
    strategy_table = {
        "數數除法、橫式除法": ["0 和 1 的除法"],
        "直式除法": [
            "除數為一位數", "四位數除以一位數", "二位數除以二位數", "三位數除以二位數", 
            "四位數除以二位數", "四位數除以三位數", "除數為三位數", "末位是 0 的除法", "大數除法"
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
        classify_result["tag"].append("division_classify.py 有 Bug, 須排除")
        classify_result["strategy"] = "因程式有錯誤，故無對應詳解工具"
        return classify_result

# 分類規則：除數為一位數
def __divisor_is_one_digit(value1, value2):
    if len(value2) == 1 and int(value2) != 0 and int(value1) != 0:
        return True
    return False

# 分類規則：0 和 1 的除法
def __division_of_0_or_1(value1, value2):
    if int(value1) == 0 or int(value1) == 1 or int(value2) == 0 or int(value2) == 1:
        return True
    return False

# 分類規則：四位數除以一位數
def __four_digit_divided_one_digit(value1, value2):
    if len(value1) == 4 and len(value2) == 1:
        return True
    return False

# 分類規則：二位數除以二位數
def __two_digit_divided_two_digit(value1, value2):
    if len(value1) == 2 and len(value2) == 2:
        return True
    return False

# 分類規則：三位數除以二位數
def __three_digit_divided_two_digit(value1, value2):
    if len(value1) == 3 and len(value2) == 2:
        return True
    return False

# 分類規則：四位數除以二位數
def __four_digit_divided_two_digit(value1, value2):
    if len(value1) == 4 and len(value2) == 2:
        return True
    return False

# 分類規則：四位數除以三位數
def __four_digit_divided_three_digit(value1, value2):
    if len(value1) == 4 and len(value2) == 3:
        return True
    return False

# 分類規則：除數為三位數
def __divisor_is_three_digit(value1, value2):
    if len(value2) == 3 and int(value2) != 0 and int(value1) != 0:
        return True
    return False

# 分類規則：末位是 0 的除法
def __the_last_bit_is_0(value1, value2):
    if int(value1) != 0 and int(value2) != 0:
        if value1[-1] == "0" or value2[-1] == "0":
            return True
    return False

# 分類規則：大數除法
def __division_of_large_numbers(value1, value2):
    if len(value1) >= 5 or len(value2) >= 4:
        return True
    return False