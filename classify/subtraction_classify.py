# 此程式會將減法的分類結果回傳
def subtraction_classify(value1, value2):
    classify_result = {"tag": [], "strategy": None}

    # 建立分類規則的字典，用來迭代尋找符合的分類標籤
    # 分類標籤須按學習階段由低到高排列（低年級 -> 高年級）
    classify_rule = {
        "10 以內的減法": __less_than_10,
        "20 以內的減法": __less_than_20,
        "二位數的減法（不退位）": __two_digit_numbers_without_abdication,
        "二位數的減法（有退位）": __two_digit_numbers_with_abdication,
        "三位數的減法（不退位）": __three_digit_numbers_without_abdication,
        "三位數的減法（有退位）": __three_digit_numbers_with_abdication,
        "四位數的減法": __four_digit_numbers,
        "十萬以內的減法": __less_than_one_hundred_thousand,
        "大數減法": __substraction_of_large_numbers,
        "運算結果小於零": __ansewr_less_then_0
    }

    # 建立分類標籤所對應的詳解工具之字典
    # 若有新增的分類標籤或詳解工具，請記得修改此字典
    strategy_table = {
        "數數減法": ["10 以內的減法", "20 以內的減法"],
        "直式減法": [
            "二位數的減法（不退位）", "二位數的減法（有退位）", "三位數的減法（不退位）", 
            "三位數的減法（有退位）", "四位數的減法", "十萬以內的減法", "大數減法"
        ],
        "無對應詳解工具": ["運算結果小於零"]
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
        classify_result["tag"].append("subtraction_classify.py 有 Bug, 須排除")
        classify_result["strategy"] = "因程式有錯誤，故無對應詳解工具"
        return classify_result

# 分類規則：10 以內的減法
def __less_than_10(value1, value2):
    if int(value1) > int(value2) and int(value1) - int(value2) <= 10:
        return True
    return False

# 分類規則：20 以內的加法
def __less_than_20(value1, value2):
    if int(value1) > int(value2) and int(value1) - int(value2) <= 20:
        return True
    return False

# 分類規則：二位數的減法（不退位）
def __two_digit_numbers_without_abdication(value1, value2):
    if int(value1) > int(value2) and max(len(value1), len(value2)) == 2:
        value1 = list(value1)[::-1]
        value2 = list(value2)[::-1]
        for i in range(min(len(value1), len(value2))):
            if int(value1[i]) - int(value2[i]) < 0:
                return False
        return True
    return False

# 分類規則：二位數的減法（有退位）
def __two_digit_numbers_with_abdication(value1, value2):
    if int(value1) > int(value2) and max(len(value1), len(value2)) == 2:
        value1 = list(value1)[::-1]
        value2 = list(value2)[::-1]
        for i in range(min(len(value1), len(value2))):
            if int(value1[i]) - int(value2[i]) < 0:
                return True
        return False
    return False

# 分類規則：三位數的減法（不退位）
def __three_digit_numbers_without_abdication(value1, value2):
    if int(value1) > int(value2) and max(len(value1), len(value2)) == 3:
        value1 = list(value1)[::-1]
        value2 = list(value2)[::-1]
        for i in range(min(len(value1), len(value2))):
            if int(value1[i]) - int(value2[i]) < 0:
                return False
        return True
    return False

# 分類規則：三位數的減法（有退位）
def __three_digit_numbers_with_abdication(value1, value2):
    if int(value1) > int(value2) and max(len(value1), len(value2)) == 3:
        value1 = list(value1)[::-1]
        value2 = list(value2)[::-1]
        for i in range(min(len(value1), len(value2))):
            if int(value1[i]) - int(value2[i]) < 0:
                return True
        return False
    return False

# 分類規則：四位數的減法
def __four_digit_numbers(value1, value2):
    if int(value1) > int(value2) and max(len(value1), len(value2)) == 4:
        return True
    return False

# 分類規則：十萬以內的減法
def __less_than_one_hundred_thousand(value1, value2):
    if int(value1) > int(value2) and int(value1) - int(value2) <= 100000:
        return True
    return False

# 分類規則：大數減法
def __substraction_of_large_numbers(value1, value2):
    if int(value1) > int(value2) and int(value1) - int(value2) > 100000:
        return True
    return False

# 分類規則：運算結果小於零
def __ansewr_less_then_0(value1, value2):
    if int(value1) < int(value2):
        return True
    return False